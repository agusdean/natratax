import { TaxRule, TaxType } from "@/types";

export interface TaxCalculationInput {
  taxType: TaxType;
  grossAmount: number;
  hasNpwp?: boolean;
  isGovernmentTreasury?: boolean; // Instansi Pemerintah / Bendahara Sekolah BOS
  category?: string;
  transactionDate?: string;
}

export interface TaxCalculationResult {
  taxType: TaxType;
  ruleCode: string;
  ruleDescription: string;
  grossAmount: number;
  taxBase: number; // DPP (Dasar Pengenaan Pajak)
  effectiveRate: number; // Percentage
  taxAmount: number;
  netAmount: number;
  isExempt: boolean;
  exemptionReason?: string;
  legalNote: string;
  version: string;
}

export class TaxRuleService {
  private static rules: TaxRule[] = [
    {
      id: "rule-ppn-11",
      code: "PPN_11_2026",
      taxType: "PPN",
      name: "PPN Penyerahan BKP/JKP Standar",
      ratePercentage: 11,
      effectiveFrom: "2022-04-01",
      effectiveTo: "2026-12-31",
      description: "Pajak Pertambahan Nilai atas pembelian barang/jasa oleh SMK",
      isGovernmentStandard: true,
      version: "2026.1",
    },
    {
      id: "rule-pph21-gtt",
      code: "PPH21_HONOR_GURU",
      taxType: "PPH21",
      name: "PPh 21 Honorarium Guru Tidak Tetap & Tenaga Ahli",
      ratePercentage: 5,
      effectiveFrom: "2024-01-01",
      description: "PPh 21 bukan pegawai berkesinambungan/tidak (5% x 50% DPP = 2.5% efektif)",
      isGovernmentStandard: true,
      version: "2026.1",
    },
    {
      id: "rule-pph22-bos",
      code: "PPH22_BENDAHARA_BOS",
      taxType: "PPH22",
      name: "PPh 22 Pengadaan Barang Bendahara Sekolah",
      ratePercentage: 1.5,
      effectiveFrom: "2024-01-01",
      description: "Pemungutan PPh 22 atas pengadaan barang bersumber dana BOS/APBN/APBD di atas Rp 2.000.000 (tidak termasuk PPN)",
      isGovernmentStandard: true,
      version: "2026.1",
    },
    {
      id: "rule-pph23-jasa",
      code: "PPH23_JASA_MAINTENANCE",
      taxType: "PPH23",
      name: "PPh 23 Pemeliharaan Laboratorium & Jasa Lainnya",
      ratePercentage: 2,
      effectiveFrom: "2024-01-01",
      description: "Pemotongan PPh 23 atas imbalan jasa teknik, manajemen, dan pemeliharaan alat praktek SMK",
      isGovernmentStandard: true,
      version: "2026.1",
    },
    {
      id: "rule-pph42-sewa",
      code: "PPH42_SEWA_GEDUNG",
      taxType: "PPH4_2",
      name: "PPh Final Pasal 4 Ayat (2) Sewa Sarana & Lahan Yayasan",
      ratePercentage: 10,
      effectiveFrom: "2022-01-01",
      description: "PPh Final atas sewa tanah dan/atau bangunan sarana yayasan / kantin sekolah",
      isGovernmentStandard: true,
      version: "2026.1",
    },
  ];

  public static getRules(): TaxRule[] {
    return [...this.rules];
  }

  public static getRuleByType(taxType: TaxType, date: string = "2026-09-01"): TaxRule | undefined {
    const checkDate = date || new Date().toISOString().split("T")[0];
    return this.rules.find((r) => {
      if (r.taxType !== taxType) return false;
      const afterStart = r.effectiveFrom <= checkDate;
      const beforeEnd = !r.effectiveTo || r.effectiveTo >= checkDate;
      return afterStart && beforeEnd;
    });
  }

  public static updateRule(id: string, updated: Partial<TaxRule>): void {
    const idx = this.rules.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.rules[idx] = { ...this.rules[idx], ...updated, version: "2026.2-CUSTOM" };
    }
  }
}

export class TaxCalculationService {
  /**
   * Deterministic tax calculation engine specifically attuned to School/Yayasan rules
   */
  public static calculate(input: TaxCalculationInput): TaxCalculationResult {
    const { taxType, grossAmount, hasNpwp = true, transactionDate } = input;

    // Strict boundary validation: Disallow negative amounts for standard transactions
    if (grossAmount < 0) {
      throw new Error(`Nilai bruto transaksi tidak boleh bernilai negatif: Rp ${grossAmount.toLocaleString("id-ID")}`);
    }

    const checkDate = transactionDate || "2026-09-01";
    const rule = TaxRuleService.getRuleByType(taxType, checkDate);

    if (!rule) {
      throw new Error(`Tidak ditemukan aturan pajak aktif untuk jenis pajak ${taxType} pada tanggal ${checkDate}. Periksa konfigurasi aturan pajak.`);
    }

    // Zero-amount edge case
    if (grossAmount === 0) {
      return {
        taxType,
        ruleCode: rule.code,
        ruleDescription: rule.name,
        grossAmount: 0,
        taxBase: 0,
        effectiveRate: 0,
        taxAmount: 0,
        netAmount: 0,
        isExempt: true,
        exemptionReason: "Nilai transaksi adalah Rp 0 (Nol)",
        legalNote: rule.description,
        version: rule.version,
      };
    }

    let dpp = grossAmount;
    let rate = rule.ratePercentage;
    let taxAmount = 0;
    let isExempt = false;
    let exemptionReason: string | undefined;
    let legalNote = rule.description;

    switch (taxType) {
      case "PPN": {
        // PPN Standar 11% (PMK-65/2022)
        dpp = grossAmount;
        taxAmount = Math.round((dpp * rate) / 100);
        legalNote = "PPN 11% dipungut oleh Rekanan / Pengusaha Kena Pajak rekanan SMK.";
        break;
      }

      case "PPH21": {
        // Honor Guru Tidak Tetap / Pemateri Workshop SMK
        // DPP = 50% dari bruto, tarif 5%. Efektif 2.5%
        dpp = Math.round(grossAmount * 0.5);
        let appliedRate = rate;
        if (!hasNpwp) {
          appliedRate = appliedRate * 1.2; // Surcharge 20% bagi non-NPWP (UU PPh Pasal 21 ayat 5a)
          legalNote += " (Dikenakan tarif 20% lebih tinggi karena tanpa NPWP/NIK tervalidasi).";
        }
        taxAmount = Math.round((dpp * appliedRate) / 100);
        break;
      }

      case "PPH22": {
        // Pengadaan barang oleh bendahara BOS (PMK 231/PMK.03/2019 jo PMK 59/PMK.03/2022)
        // Transaksi tidak melebihi Rp 2.000.000 (tidak termasuk PPN) dikecualikan dari pemungutan
        if (grossAmount <= 2000000) {
          isExempt = true;
          exemptionReason = "Nilai transaksi <= Rp 2.000.000 dibebaskan dari pemungutan PPh 22 bendahara BOS.";
          taxAmount = 0;
        } else {
          let appliedRate = rate;
          if (!hasNpwp) {
            appliedRate = appliedRate * 2.0; // 100% lebih tinggi bagi non-NPWP
            legalNote += " (Tarif 100% lebih tinggi bagi non-NPWP).";
          }
          taxAmount = Math.round((grossAmount * appliedRate) / 100);
        }
        break;
      }

      case "PPH23": {
        // Jasa perbaikan, instalasi lab komputer, sewa sarana selain tanah/bangunan
        let appliedRate = rate;
        if (!hasNpwp) {
          appliedRate = appliedRate * 2.0; // 100% lebih tinggi bagi non-NPWP
          legalNote += " (Tarif 100% lebih tinggi bagi non-NPWP).";
        }
        taxAmount = Math.round((grossAmount * appliedRate) / 100);
        break;
      }

      case "PPH4_2": {
        // Sewa sarana/lahan yayasan, konstruksi rehab ruang kelas
        taxAmount = Math.round((grossAmount * rate) / 100);
        legalNote = "PPh Final Pasal 4 Ayat 2 disetor penuh ke kas negara melalui modul Billing Pembayaran.";
        break;
      }
    }

    const netAmount = grossAmount - taxAmount;

    return {
      taxType,
      ruleCode: rule.code,
      ruleDescription: rule.name,
      grossAmount,
      taxBase: dpp,
      effectiveRate: isExempt ? 0 : rate,
      taxAmount,
      netAmount,
      isExempt,
      exemptionReason,
      legalNote,
      version: rule.version,
    };
  }
}
