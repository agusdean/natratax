"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, Files, Calendar, Calculator, CheckCircle2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface CreateSptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSptModal: React.FC<CreateSptModalProps> = ({ isOpen, onClose }) => {
  const { addSpt } = useApp();

  const [taxType, setTaxType] = useState("SPT Masa Unifikasi");
  const [sptCategory, setSptCategory] = useState<"MASA" | "TAHUNAN" | "PEMBETULAN">("MASA");
  const [periodMonth, setPeriodMonth] = useState(9); // September
  const [periodYear, setPeriodYear] = useState(2026);
  const [totalDpp, setTotalDpp] = useState(22700000);
  const [totalTax, setTotalTax] = useState(1436500);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const monthNames = [
      "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const taxPeriod = `${monthNames[periodMonth]} ${periodYear}`;

    addSpt({
      taxType,
      sptCategory,
      taxPeriod,
      periodMonth,
      periodYear,
      totalDpp,
      totalTax,
      status: "KONSEP",
      billingCode: `0239 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-slate-900 dark:to-indigo-950/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#381750] text-white flex items-center justify-center shadow-xs">
              <Files className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">
                Buat Konsep SPT Baru
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Penyusunan Formulir SPT Masa Pajak Sekolah & Yayasan
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Jenis Formulir Pajak
            </label>
            <select
              value={taxType}
              onChange={(e) => setTaxType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="SPT Masa Unifikasi">SPT Masa Unifikasi (PPh Pasal 22, 23, 4(2), 15)</option>
              <option value="SPT Masa PPh 21/26">SPT Masa PPh Pasal 21/26 (Honor Guru GTT & Pegawai)</option>
              <option value="SPT Masa PPN 1107 PUT">SPT Masa PPN 1107 PUT (Pemungut Bendahara BOS)</option>
              <option value="SPT Tahunan Badan (Yayasan)">SPT Tahunan Badan (Yayasan Bina Putra)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori SPT
              </label>
              <select
                value={sptCategory}
                onChange={(e) => setSptCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs font-medium text-slate-800 dark:text-slate-100"
              >
                <option value="MASA">Normal (Masa Reguler)</option>
                <option value="PEMBETULAN">Pembetulan ke-1</option>
                <option value="TAHUNAN">Tahunan Buku</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Masa & Tahun Pajak
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={periodMonth}
                  onChange={(e) => setPeriodMonth(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs"
                >
                  <option value={9}>09 (Sep)</option>
                  <option value={10}>10 (Okt)</option>
                  <option value={11}>11 (Nov)</option>
                  <option value={12}>12 (Des)</option>
                </select>
                <input
                  type="number"
                  value={periodYear}
                  onChange={(e) => setPeriodYear(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs font-mono text-center"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="font-medium">Total DPP Penghasilan / Tagihan:</span>
              <div className="w-40">
                <input
                  type="number"
                  value={totalDpp}
                  onChange={(e) => setTotalDpp(Number(e.target.value))}
                  className="w-full text-right font-mono font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1.5"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Calculator className="w-4 h-4" />
                Pajak Terutang (Kurang Setor):
              </span>
              <div className="w-40">
                <input
                  type="number"
                  value={totalTax}
                  onChange={(e) => setTotalTax(Number(e.target.value))}
                  className="w-full text-right font-mono font-black text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded p-1.5"
                />
              </div>
            </div>
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
              className="px-5 py-2 rounded-lg bg-[#381750] hover:bg-[#461e63] text-white text-xs font-bold shadow-md shadow-purple-900/30 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Konsep SPT
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
