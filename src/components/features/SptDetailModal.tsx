"use client";

import React from "react";
import { SptRecord } from "@/types";
import { X, Printer, Files, CheckCircle2, ShieldCheck } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface SptDetailModalProps {
  spt: SptRecord | null;
  onClose: () => void;
}

export const SptDetailModal: React.FC<SptDetailModalProps> = ({ spt, onClose }) => {
  if (!spt) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-purple-50/50 dark:from-slate-900 dark:to-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <Files className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Rincian Induk & Lampiran SPT Masa
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {spt.taxType} — {spt.taxPeriod}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SPT Body View */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Nama Wajib Pajak:</span>
              <span className="font-bold text-slate-800 dark:text-white">SMK BINA PUTRA JAKARTA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">NPWP Instansi:</span>
              <span className="font-mono font-bold">99.886.600.0-010.609</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Masa / Tahun Pajak:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{spt.taxPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status SPT:</span>
              <span className="font-bold text-emerald-600">{spt.status}</span>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
              Ringkasan Rekapitulasi Penghitungan Pajak
            </h4>
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>Total Dasar Pengenaan Pajak (DPP):</span>
              <span className="font-mono font-bold">{formatRupiah(spt.totalDpp)}</span>
            </div>
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <span>Pajak Penghasilan / PPN Terutang:</span>
              <span className="font-mono font-bold text-amber-600">{formatRupiah(spt.totalTax)}</span>
            </div>
            <div className="flex justify-between text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800 font-bold">
              <span>Kode Billing Penyetoran:</span>
              <span className="font-mono text-indigo-700 dark:text-indigo-400">{spt.billingCode || "Menunggu Generate Billing"}</span>
            </div>
            {spt.ntpn && (
              <div className="flex justify-between text-emerald-600 font-bold pt-1">
                <span>Bukti NTPN Sah:</span>
                <span className="font-mono">{spt.ntpn}</span>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Tutup
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-[#381750] text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Formulir SPT</span>
          </button>
        </div>

      </div>
    </div>
  );
};
