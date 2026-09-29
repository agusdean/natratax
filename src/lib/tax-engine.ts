import { TaxRule, TaxType, TaxObject } from "@/types";

export interface TaxCalculationInput {
  taxType: TaxType;
  grossAmount: number;
  hasNpwp?: boolean;
  isGovernmentTreasury?: boolean; // Instansi Pemerintah / Bendahara Sekolah BOS
  category?: string;
  transactionDate?: string;
  taxObjectCode?: string;
}

export interface TaxCalculationResult {
  taxType: TaxType;
  taxObjectCode: string;
  ruleCode: string;
  ruleDescription: string;
  formula: string;
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

export const STANDARD_TAX_OBJECTS: TaxObject[] = [
  {
    code: "PPN-01",
    name: "Penyerahan BKP dan/atau JKP Standar SMK",
    taxType: "PPN",
    defaultRate: 11,
    description: "Pajak Pertambahan Nilai 11% (UU HPP / PMK-65/2022) atas perolehan sarana & jasa sekolah.",
  },
  {
    code: "21-100-01",
    name: "Pegawai Tetap / Guru Tetap Yayasan (GTY)",
    taxType: "PPH21",
    defaultRate: 5,
    description: "Pemotongan PPh 21 atas penghasilan bruto pegawai tetap / guru tetap yayasan bulanan.",
  },
  {
    code: "21-100-02",
    name: "Guru Tidak Tetap (GTT) & Tenaga Ahli Workshop",
    taxType: "PPH21",
    defaultRate: 5,
    description: "PPh 21 bukan pegawai berkesinambungan/tidak (5% x 50% DPP = 2.5% efektif). Non-NPWP +20%.",
  },
  {
    code: "22-100-01",
    name: "Pengadaan Barang Bendahara BOS (Dana BOS/APBN/APBD)",
    taxType: "PPH22",
    defaultRate: 1.5,
    description: "Pemungutan PPh 22 pengadaan barang oleh bendahara BOS. Nilai <= Rp 2.000.000 dibebaskan.",
    isExemptBelowThreshold: true,
    thresholdAmount: 2000000,
  },
  {
    code: "23-100-01",
    name: "Pemeliharaan Alat Praktik Lab & Sarana IT",
    taxType: "PPH23",
    defaultRate: 2,
    description: "Pemotongan PPh 23 imbalan jasa perbaikan laboratorium dan perangkat IT vokasi (2%). Non-NPWP 100%.",
  },
  {
    code: "23-100-02",
    name: "Sewa Peralatan Praktek & Kendaraan Operasional",
    taxType: "PPH23",
    defaultRate: 2,
    description: "Pemotongan PPh 23 sewa selain tanah dan/atau bangunan (2%). Non-NPWP 100%.",
  },
  {
    code: "4(2)-100-01",
    name: "Sewa Tanah dan/atau Bangunan Sarana Yayasan",
    taxType: "PPH4_2",
    defaultRate: 10,
    description: "PPh Final Pasal 4 ayat (2) atas persewaan tanah dan/atau gedung sekolah & kantin yayasan (10%).",
  },
];

export class TaxRuleService {
  private static rules: TaxRule[] = [
    {
      id: "rule-ppn-11",
      code: "PPN_11_2026",
      taxType: "PPN",
      taxObjectCode: "PPN-01",
      name: "PPN Penyerahan BKP/JKP Standar",
      ratePercentage: 11,
      formula: "DPP * 11%",
      effectiveFrom: "2022-04-01",
      effectiveTo: "2026-12-31",
      description: "Pajak Pertambahan Nilai atas pembelian barang/jasa oleh SMK",
      isGovernmentStandard: true,
      version: "2026.1",
      status: "ACTIVE",
    },
    {
      id: "rule-pph21-gtt",
      code: "PPH21_HONOR_GURU",
      taxType: "PPH21",
      taxObjectCode: "21-100-02",
      name: "PPh 21 Honorarium Guru Tidak Tetap & Tenaga Ahli",
      ratePercentage: 5,
      formula: "(Gross * 50%) * 5%",
      effectiveFrom: "2024-01-01",
      description: "PPh 21 bukan pegawai berkesinambungan/tidak (5% x 50% DPP = 2.5% efektif)",
      isGovernmentStandard: true,
      version: "2026.1",
      status: "ACTIVE",
    },
    {
      id: "rule-pph21-gty",
      code: "PPH21_GURU_TETAP",
      taxType: "PPH21",
      taxObjectCode: "21-100-01",
      name: "PPh 21 Pegawai Tetap / Guru Tetap Yayasan (GTY)",
      ratePercentage: 5,
      formula: "Gross * Tarif Efektif Rata-rata (TER)",
      effectiveFrom: "2024-01-01",
      description: "Pemotongan PPh 21 bulanan berdasarkan PP 58/2023 dan PMK 168/2023",
      isGovernmentStandard: true,
      version: "2026.1",
      status: "ACTIVE",
    },
    {
      id: "rule-pph22-bos",
      code: "PPH22_BENDAHARA_BOS",
      taxType: "PPH22",
      taxObjectCode: "22-100-01",
      name: "PPh 22 Pengadaan Barang Bendahara Sekolah",
      ratePercentage: 1.5,
      formula: "Gross > 2.000.000 ? Gross * 1.5% : 0",
      effectiveFrom: "2024-01-01",
      description: "Pemungutan PPh 22 atas pengadaan barang bersumber dana BOS/APBN/APBD di atas Rp 2.000.000 (tidak termasuk PPN)",
      isGovernmentStandard: true,
      version: "2026.1",
      status: "ACTIVE",
    },
    {
      id: "rule-pph23-jasa",
      code: "PPH23_JASA_MAINTENANCE",
      taxType: "PPH23",
      taxObjectCode: "23-100-01",
      name: "PPh 23 Pemeliharaan Laboratorium & Jasa Lainnya",
      ratePercentage: 2,
      formula: "Gross * 2%",
      effectiveFrom: "2024-01-01",
      description: "Pemotongan PPh 23 atas imbalan jasa teknik, manajemen, dan pemeliharaan alat praktek SMK",
      isGovernmentStandard: true,
      version: "2026.1",
      status: "ACTIVE",
    },
    {
      id: "rule-pph23-sewa",
      code: "PPH23_SEWA_ALAT",
      taxType: "PPH23",
      taxObjectCode: "23-100-02",
      name: "PPh 23 Sewa Peralatan Praktek & Kendaraan",
      ratePercentage: 2,
      formula: "Gross * 2%",
      effectiveFrom: "2024-01-01",
      description: "Pemotongan PPh 23 atas sewa harta selain tanah dan/atau bangunan",
      isGovernmentStandard: true,
      version: "2026.1",
      status: "ACTIVE",
    },
    {
      id: "rule-pph42-sewa",
      code: "PPH42_SEWA_GEDUNG",
      taxType: "PPH4_2",
      taxObjectCode: "4(2)-100-01",
      name: "PPh Final Pasal 4 Ayat (2) Sewa Sarana & Lahan Yayasan",
      ratePercentage: 10,
      formula: "Gross * 10%",
      effectiveFrom: "2022-01-01",
      description: "PPh Final atas sewa tanah dan/atau bangunan sarana yayasan / kantin sekolah",
      isGovernmentStandard: true,
      version: "2026.1",
      status: "ACTIVE",
    },
  ];

  public static getRules(): TaxRule[] {
    return [...this.rules];
  }

  public static getTaxObjects(): TaxObject[] {
    return [...STANDARD_TAX_OBJECTS];
  }

  public static getRuleByTaxObject(objectCode: string, date: string = "2026-09-01"): TaxRule | undefined {
    const checkDate = date || new Date().toISOString().split("T")[0];
    return this.rules.find((r) => {
      if (r.taxObjectCode !== objectCode) return false;
      const afterStart = r.effectiveFrom <= checkDate;
      const beforeEnd = !r.effectiveTo || r.effectiveTo >= checkDate;
      const isActive = !r.status || r.status === "ACTIVE";
      return afterStart && beforeEnd && isActive;
    });
  }

  public static getRuleByType(taxType: TaxType, date: string = "2026-09-01"): TaxRule | undefined {
    const checkDate = date || new Date().toISOString().split("T")[0];
    return this.rules.find((r) => {
      if (r.taxType !== taxType) return false;
      const afterStart = r.effectiveFrom <= checkDate;
      const beforeEnd = !r.effectiveTo || r.effectiveTo >= checkDate;
      const isActive = !r.status || r.status === "ACTIVE";
      return afterStart && beforeEnd && isActive;
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
    const { taxType, grossAmount, hasNpwp = true, transactionDate, taxObjectCode } = input;

    // Strict boundary validation: Disallow negative amounts for standard transactions
    if (grossAmount < 0) {
      throw new Error(`Nilai bruto transaksi tidak boleh bernilai negatif: Rp ${grossAmount.toLocaleString("id-ID")}`);
    }

    const checkDate = transactionDate || "2026-09-01";
    let rule: TaxRule | undefined;

    if (taxObjectCode) {
      rule = TaxRuleService.getRuleByTaxObject(taxObjectCode, checkDate);
    }
    if (!rule) {
      rule = TaxRuleService.getRuleByType(taxType, checkDate);
    }

    if (!rule) {
      throw new Error(`Tidak ditemukan aturan pajak aktif untuk jenis pajak ${taxType}${taxObjectCode ? ` (Objek: ${taxObjectCode})` : ""} pada tanggal ${checkDate}. Periksa konfigurasi aturan pajak.`);
    }

    const resolvedObjectCode = rule.taxObjectCode || taxObjectCode || "GENERIC";

    // Zero-amount edge case
    if (grossAmount === 0) {
      return {
        taxType,
        taxObjectCode: resolvedObjectCode,
        ruleCode: rule.code,
        ruleDescription: rule.name,
        formula: rule.formula || "0",
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
      taxObjectCode: resolvedObjectCode,
      ruleCode: rule.code,
      ruleDescription: rule.name,
      formula: rule.formula || `${rate}%`,
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

  public static calculateByTaxObject(
    taxObjectCode: string, 
    grossAmount: number, 
    options: { hasNpwp?: boolean; transactionDate?: string } = {}
  ): TaxCalculationResult {
    const obj = STANDARD_TAX_OBJECTS.find((o) => o.code === taxObjectCode);
    if (!obj) {
      throw new Error(`Kode objek pajak '${taxObjectCode}' tidak dikenali dalam master objek pajak resmi.`);
    }
    return this.calculate({
      taxType: obj.taxType,
      grossAmount,
      taxObjectCode,
      hasNpwp: options.hasNpwp ?? true,
      transactionDate: options.transactionDate,
    });
  }
}
