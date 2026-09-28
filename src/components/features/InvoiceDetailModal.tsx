"use client";

import React from "react";
import { Invoice } from "@/types";
import { X, Printer, Download, ShieldCheck, Building2, FileText, CheckCircle2 } from "lucide-react";
import { formatRupiah, formatDateIndo, formatNPWP } from "@/lib/utils";

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-slate-900 dark:to-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Faktur Pajak — {invoice.type === "KELUARAN" ? "Pajak Keluaran" : "Pajak Masukan"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {invoice.taxInvoiceNumber}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Printable View */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-slate-800 dark:border-slate-200 pb-4 flex justify-between items-start">
            <div>
              <span className="font-extrabold text-base tracking-tight text-indigo-900 dark:text-indigo-300">
                Natra<span className="text-amber-500">Tax</span> Faktur Elektronik
              </span>
              <p className="font-bold text-slate-800 dark:text-white text-xs mt-0.5">
                SMK BINA PUTRA JAKARTA
              </p>
              <p className="text-[11px] text-slate-500">
                Unit Pengelola Keuangan Sekolah & Pengadaan BOS
              </p>
            </div>
            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                STATUS: {invoice.status}
              </span>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Tanggal: {formatDateIndo(invoice.date)}
              </p>
            </div>
          </div>

          {/* Parties Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {invoice.type === "KELUARAN" ? "Pengusaha Kena Pajak (Penjual)" : "Pihak Pembeli (Sekolah)"}
              </p>
              <p className="font-bold text-slate-900 dark:text-white">SMK BINA PUTRA JAKARTA</p>
              <p className="font-mono text-slate-500 text-[11px] mt-0.5">NPWP: 99.886.600.0-010.609</p>
              <p className="text-slate-500 text-[11px]">KPP Pratama Jakarta Matraman</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {invoice.type === "KELUARAN" ? "Pihak Pembeli / Mitra" : "Penyedia Barang/Jasa (Vendor)"}
              </p>
              <p className="font-bold text-slate-900 dark:text-white">{invoice.counterpartyName}</p>
              <p className="font-mono text-slate-500 text-[11px] mt-0.5">NPWP: {formatNPWP(invoice.counterpartyNpwp)}</p>
              <p className="text-slate-500 text-[11px]">Terdaftar Sistem Rekanan Sekolah</p>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 font-bold text-slate-700 dark:text-slate-300 flex justify-between border-b border-slate-200 dark:border-slate-700">
              <span>Uraian Penyerahan BKP / JKP</span>
              <span>Jumlah (Rupiah)</span>
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    Nilai Pengadaan / Dasar Pengenaan Pajak (DPP)
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">Invoice Ref: {invoice.invoiceNumber}</p>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatRupiah(invoice.dpp)}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="font-bold text-indigo-700 dark:text-indigo-400">
                  Pajak Pertambahan Nilai (PPN 11%)
                </p>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatRupiah(invoice.ppnAmount)}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t-2 border-slate-200 dark:border-slate-700 text-sm font-black">
                <span className="text-slate-900 dark:text-white">Total Tagihan Termasuk PPN:</span>
                <span className="font-mono text-indigo-700 dark:text-indigo-400">
                  {formatRupiah(invoice.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="pt-2 flex justify-between items-end text-[11px] text-slate-500">
            <div>
              <p>Dibuat Oleh: <strong>{invoice.createdBy}</strong></p>
              <p className="font-mono text-[10px] text-slate-400 mt-0.5">Sistem Validasi Internal NatraTax</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800 dark:text-white">Bendahara Sekolah</p>
              <div className="h-10 flex items-center justify-end">
                <span className="px-2 py-0.5 rounded border border-emerald-300 text-emerald-600 font-mono text-[9px] font-bold">
                  TERTANDATANGAN ELEKTRONIK
                </span>
              </div>
              <p className="font-bold text-slate-700 dark:text-slate-300">DUWI HERU SANTOSO, S.AK</p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Salinan Faktur</span>
          </button>
        </div>

      </div>
    </div>
  );
};
