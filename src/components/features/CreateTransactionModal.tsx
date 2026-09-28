"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { TaxCalculationService } from "@/lib/tax-engine";
import { TaxType } from "@/types";
import { X, PlusCircle, Calculator, Check, AlertCircle, Building2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction } = useApp();

  const [date, setDate] = useState("2026-09-28");
  const [type, setType] = useState<"PENGADAAN_BOS" | "HONOR_GURU" | "SEWA_GEDUNG" | "JASA_LAB" | "OPERASIONAL">("PENGADAAN_BOS");
  const [categoryName, setCategoryName] = useState("Pengadaan Sarana Praktik Kejuruan SMK");
  const [vendorName, setVendorName] = useState("PT Mitra Karya Teknologi");
  const [vendorNpwp, setVendorNpwp] = useState("01.882.312.4-019.000");
  const [hasNpwp, setHasNpwp] = useState(true);
  const [description, setDescription] = useState("Pengadaan alat praktik perakitan komputer dan perlengkapan jaringan BOS SMK");
  const [grossAmount, setGrossAmount] = useState<number>(15000000);
  const [taxType, setTaxType] = useState<TaxType>("PPN");

  // Live tax calculation state
  const [calcResult, setCalcResult] = useState(() =>
    TaxCalculationService.calculate({
      taxType: "PPN",
      grossAmount: 15000000,
      hasNpwp: true,
    })
  );

  // Recalculate tax whenever input parameters change
  useEffect(() => {
    try {
      const res = TaxCalculationService.calculate({
        taxType,
        grossAmount: Number(grossAmount) || 0,
        hasNpwp,
        transactionDate: date,
      });
      setCalcResult(res);
    } catch {
      // Ignore calc error
    }
  }, [taxType, grossAmount, hasNpwp, date]);

  // Adjust defaults when type changes
  const handleTypeChange = (newType: typeof type) => {
    setType(newType);
    if (newType === "PENGADAAN_BOS") {
      setTaxType("PPN");
      setCategoryName("Pengadaan Sarana & Prasarana BOS");
    } else if (newType === "HONOR_GURU") {
      setTaxType("PPH21");
      setCategoryName("Honorarium Guru Tidak Tetap & Asesor UKK");
    } else if (newType === "JASA_LAB") {
      setTaxType("PPH23");
      setCategoryName("Pemeliharaan Laboratorium Komputer & Bengkel");
    } else if (newType === "SEWA_GEDUNG") {
      setTaxType("PPH4_2");
      setCategoryName("Sewa Lahan Fasilitas & Kantin Yayasan");
    } else {
      setTaxType("PPH22");
      setCategoryName("Pembelian ATK & Logistik Sekolah");
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addTransaction({
      date,
      type,
      categoryName,
      vendorName,
      vendorNpwp: hasNpwp ? vendorNpwp : "TIDAK BER-NPWP",
      description,
      grossAmount,
      taxType,
      taxBase: calcResult.taxBase,
      taxRate: calcResult.effectiveRate,
      taxAmount: calcResult.taxAmount,
      netAmount: calcResult.netAmount,
      status: "UNDER_REVIEW",
      attachmentsCount: 1,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-slate-900 dark:to-indigo-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">
                Tambah Transaksi Keuangan & Pajak Sekolah
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pencatatan Transaksi BOS & Pemotongan Pajak Terintegrasi
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Klasifikasi Transaksi Sekolah
              </label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100"
              >
                <option value="PENGADAAN_BOS">Pengadaan Barang / Sarpras BOS (PPN 11%)</option>
                <option value="HONOR_GURU">Honor Guru GTT & Narasumber (PPh 21)</option>
                <option value="JASA_LAB">Jasa Maintenance & Lab Komputer (PPh 23)</option>
                <option value="SEWA_GEDUNG">Sewa Lahan / Sarana Kantin (PPh Final 4(2))</option>
                <option value="OPERASIONAL">Pengadaan ATK Rutin (PPh 22)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal Transaksi
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Uraian / Kategori Pengeluaran
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-100"
              placeholder="Contoh: Pengadaan Komputer Lab RPL"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Rekanan / Penerima Penghasilan
              </label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-800 dark:text-slate-100"
                placeholder="Nama Perusahaan atau Nama Guru/Narasumber"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Nomor NPWP / NIK
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-500">
                  <input
                    type="checkbox"
                    checked={hasNpwp}
                    onChange={(e) => setHasNpwp(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Memiliki NPWP</span>
                </label>
              </div>
              <input
                type="text"
                disabled={!hasNpwp}
                value={hasNpwp ? vendorNpwp : "TIDAK BER-NPWP (+Tarif Lebih Tinggi)"}
                onChange={(e) => setVendorNpwp(e.target.value)}
                className={`w-full border rounded-lg p-2.5 text-xs font-mono ${
                  hasNpwp
                    ? "bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                    : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-700 dark:text-amber-300 font-semibold"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Keterangan Lengkap Transaksi
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs"
            />
          </div>

          {/* Tax Engine Live Calculation Card */}
          <div className="rounded-xl bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-slate-50 dark:from-slate-800/80 dark:to-indigo-950/40 p-4 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-200/70 dark:border-indigo-900/60">
              <span className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-indigo-600" />
                Mesin Kalkulasi Pajak Terintegrasi (Tax Rule Engine)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                Rule: {calcResult.ruleCode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nilai Bruto Tagihan (Rp)
                </label>
                <input
                  type="number"
                  value={grossAmount}
                  onChange={(e) => setGrossAmount(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Jenis Pajak Dikenakan
                </label>
                <select
                  value={taxType}
                  onChange={(e) => setTaxType(e.target.value as TaxType)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-bold"
                >
                  <option value="PPN">PPN (Pajak Pertambahan Nilai)</option>
                  <option value="PPH21">PPh 21 (Honor Tenaga Pendidik / Asesor)</option>
                  <option value="PPH22">PPh 22 (Barang BOS Bendahara)</option>
                  <option value="PPH23">PPh 23 (Jasa Pemeliharaan / Lab)</option>
                  <option value="PPH4_2">PPh 4(2) Final (Sewa Lahan & Sarana)</option>
                </select>
              </div>
            </div>

            {/* Computation Results */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-3 border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">DPP Pajak</p>
                <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {formatRupiah(calcResult.taxBase)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Tarif Efektif</p>
                <p className="text-xs font-mono font-bold text-amber-600 mt-0.5">
                  {calcResult.effectiveRate}%
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Potongan Pajak</p>
                <p className="text-xs font-mono font-black text-red-600 dark:text-red-400 mt-0.5">
                  {formatRupiah(calcResult.taxAmount)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Netto Dibayarkan</p>
                <p className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {formatRupiah(calcResult.netAmount)}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              ℹ️ {calcResult.legalNote}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 -mx-5 -mb-5 mt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Simpan & Ajukan Verifikasi
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
