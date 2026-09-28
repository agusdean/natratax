import React from "react";
import Link from "next/link";
import { Lock, ArrowLeft, ShieldAlert, KeyRound } from "lucide-react";

export default function SecurityPage() {
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
            <div className="w-12 h-12 rounded-2xl bg-indigo-700 text-white flex items-center justify-center shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Standar Keamanan Sistem & Audit Trail Forensik
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Protokol Keamanan Finansial • SMK BINA PUTRA JAKARTA
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Prinsip Audit Trail Tidak Dapat Dihapus (Immutable Log)</h2>
            <p>
              Setiap pembuatan faktur, pengajuan transaksi belanja BOS, persetujuan kepala sekolah, hingga validasi NTPN penyetoran kas negara dicatat secara otomatis dalam log forensik audit trail dengan stempel waktu terverifikasi dan alamat IP. Log ini tidak dapat diedit atau dihapus oleh pengguna level apa pun.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Otentikasi & Otorisasi Bertingkat (RBAC)</h2>
            <p>
              Pemisahan wewenang (*Separation of Duties*) diterapkan secara ketat antara operator pembukuan BOS, verifikator satuan pengawas internal (SPI), bendahara sekolah, dan kepala sekolah. Tidak ada persetujuan transaksi yang dapat disahkan secara sepihak tanpa melewati alur telaah validasi.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Integritas Kode Sumber & Data Finansial</h2>
            <p>
              Seluruh kalkulasi pemotongan PPh Pasal 21, PPh 22, PPh 23, PPh Final 4(2), dan PPN 11% dikelola oleh mesin kalkulasi deterministik (*Deterministic Tax Engine*) terpusat untuk menghindari manipulasi formula pada tingkat aplikasi.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
