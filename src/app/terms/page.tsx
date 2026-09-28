import React from "react";
import Link from "next/link";
import { FileCheck, ArrowLeft, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Portal NatraTax</span>
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <FileCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Syarat & Ketentuan Penggunaan Sistem NatraTax
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                SMK BINA PUTRA JAKARTA • Pedoman Operasional Internal
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <strong>Ketentuan Hukum Penting:</strong> NatraTax adalah perangkat lunak administrasi internal satuan pendidikan. Pengguna dilarang merepresentasikan laporan konsep di dalam aplikasi ini sebagai bukti pelaporan resmi negara sebelum memperoleh Bukti Penerimaan Elektronik (BPE) resmi dari Direktorat Jenderal Pajak.
              </div>
            </div>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Pengguna Berhak</h2>
            <p>
              Hak akses NatraTax hanya diberikan kepada dewan guru, bendahara, staf tata usaha, kepala sekolah, serta auditor pengawas Yayasan Pendidikan Bina Putra yang telah diberikan kredensial resmi.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Keabsahan Dokumen Pendukung</h2>
            <p>
              Operator dan staf pengadaan wajib melampirkan kuitansi asli, faktur pajak rekanan SIPLah, berita acara serah terima barang (BAST), dan bukti transfer kas sekolah yang sah untuk setiap transaksi yang diajukan ke dalam sistem.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
