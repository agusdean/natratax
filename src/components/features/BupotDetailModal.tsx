"use client";

import React from "react";
import { WithholdingSlip } from "@/types";
import { X, Printer, FileCheck2, ShieldCheck } from "lucide-react";
import { formatRupiah, formatNPWP } from "@/lib/utils";

interface BupotDetailModalProps {
  bupot: WithholdingSlip | null;
  onClose: () => void;
}

export const BupotDetailModal: React.FC<BupotDetailModalProps> = ({ bupot, onClose }) => {
  if (!bupot) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-purple-50/50 dark:from-slate-900 dark:to-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Bukti Pemotongan Pajak Penghasilan (e-Bupot)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {bupot.bupotNumber}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          <div className="border-b-2 border-slate-800 dark:border-slate-200 pb-3 flex justify-between items-start">
            <div>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                PEMERINTAH DAERAH PROVINSI DKI JAKARTA / YAYASAN BINA PUTRA
              </p>
              <p className="font-bold text-indigo-700 dark:text-indigo-400 text-xs">
                SMK BINA PUTRA JAKARTA (BENDAHARA PENGELUARAN BOS)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono">
              FORM {bupot.bupotType}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Nama Penerima Penghasilan:</span>
              <span className="font-bold text-slate-900 dark:text-white">{bupot.beneficiaryName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">NPWP / NIK Penerima:</span>
              <span className="font-mono font-bold">{formatNPWP(bupot.beneficiaryNpwpNik)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kode Objek Pajak:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {bupot.taxObjectCode} — {bupot.objectDescription}
              </span>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Jumlah Penghasilan Bruto:</span>
              <span className="font-mono font-bold">{formatRupiah(bupot.grossAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-300">Tarif Pemotongan Efektif:</span>
              <span className="font-mono font-bold text-amber-600">{bupot.effectiveRate}%</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800 font-bold text-sm">
              <span className="text-slate-900 dark:text-white">PPh yang Dipotong:</span>
              <span className="font-mono text-red-600 dark:text-red-400">{formatRupiah(bupot.taxWithheld)}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              Bukti Pemotongan ini diterbitkan melalui sistem internal NatraTax dan tercatat dalam SPT Masa Unifikasi instansi sekolah.
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
          >
            Tutup
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Bukti Potong</span>
          </button>
        </div>

      </div>
    </div>
  );
};
