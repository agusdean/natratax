<?php

namespace App\Services;

class TaxCalculationService
{
    /**
     * Deterministic tax calculation service for School & Foundation transactions
     *
     * @param string $taxType PPN | PPH21 | PPH22 | PPH23 | PPH4_2
     * @param float $grossAmount
     * @param bool $hasNpwp
     * @param string|null $date
     * @return array
     */
    public function calculate(string $taxType, float $grossAmount, bool $hasNpwp = true, ?string $date = null): array
    {
        $taxBase = $grossAmount;
        $effectiveRate = 0.0;
        $taxAmount = 0.0;
        $isExempt = false;
        $note = "Perhitungan pajak otomatis NatraTax";

        switch (strtoupper($taxType)) {
            case 'PPN':
                $effectiveRate = 11.0;
                $taxBase = $grossAmount;
                $taxAmount = round(($taxBase * $effectiveRate) / 100);
                $note = "PPN 11% dipungut atas belanja BKP/JKP rekanan sekolah.";
                break;

            case 'PPH21':
                // Honor Guru GTT / Asesor UKK (50% dari bruto, tarif 5%)
                $taxBase = round($grossAmount * 0.5);
                $effectiveRate = $hasNpwp ? 5.0 : 6.0; // 20% surcharge if non-NPWP
                $taxAmount = round(($taxBase * $effectiveRate) / 100);
                $note = "PPh 21 bukan pegawai berkesinambungan (5% x 50% DPP).";
                break;

            case 'PPH22':
                // Pengadaan barang oleh bendahara BOS
                if ($grossAmount <= 2000000) {
                    $isExempt = true;
                    $effectiveRate = 0.0;
                    $taxAmount = 0.0;
                    $note = "Transaksi <= Rp 2.000.000 dibebaskan dari pemungutan PPh 22 bendahara BOS.";
                } else {
                    $effectiveRate = $hasNpwp ? 1.5 : 3.0; // 100% higher if non-NPWP
                    $taxAmount = round(($grossAmount * $effectiveRate) / 100);
                    $note = "PPh 22 Pengadaan barang sekolah via dana BOS.";
                }
                break;

            case 'PPH23':
                // Jasa perbaikan, instalasi server, pemeliharaan lab
                $effectiveRate = $hasNpwp ? 2.0 : 4.0;
                $taxAmount = round(($grossAmount * $effectiveRate) / 100);
                $note = "PPh 23 Jasa pemeliharaan laboratorium komputer dan sarana sekolah.";
                break;

            case 'PPH4_2':
                // Sewa sarana lahan/bangunan kantin yayasan
                $effectiveRate = 10.0;
                $taxAmount = round(($grossAmount * $effectiveRate) / 100);
                $note = "PPh Final Pasal 4 Ayat 2 sewa tanah/bangunan sarana yayasan.";
                break;

            default:
                throw new \InvalidArgumentException("Jenis pajak {$taxType} tidak didukung.");
        }

        $netAmount = $grossAmount - $taxAmount;

        return [
            'tax_type' => $taxType,
            'gross_amount' => $grossAmount,
            'tax_base' => $taxBase,
            'effective_rate' => $effectiveRate,
            'tax_amount' => $taxAmount,
            'net_amount' => $netAmount,
            'is_exempt' => $isExempt,
            'legal_note' => $note,
            'rule_version' => '2026.1-PROD'
        ];
    }
}
