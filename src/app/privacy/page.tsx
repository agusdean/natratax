import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Building2 } from "lucide-react";

export default function PrivacyPage() {
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
            <div className="w-12 h-12 rounded-2xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Kebijakan Privasi & Perlindungan Data Perpajakan
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                SMK BINA PUTRA JAKARTA • Sistem Administrasi Internal Pendidikan
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Ruang Lingkup Data</h2>
            <p>
              Sistem NatraTax mengelola data finansial, bukti belanja dana Bantuan Operasional Sekolah (BOS), kuitansi rekanan, data NPWP/NIK guru tidak tetap (GTT), instruktur penguji UKK, dan penyedia barang/jasa yang bermitra secara sah dengan SMK BINA PUTRA JAKARTA.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Kerahasiaan Nomor Identitas Kependudukan (NIK) & NPWP</h2>
            <p>
              Sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022), seluruh data identitas wajib pajak orang pribadi dan badan disimpan secara terenkripsi. Akses terhadap berkas bukti potong (e-Bupot) hanya diberikan kepada staf bagian keuangan sekolah yang memiliki surat tugas resmi dari Kepala Sekolah.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Batasan Pihak Ketiga & Integrasi</h2>
            <p>
              NatraTax tidak membagikan, memperjualbelikan, atau mendistribusikan data transaksi sekolah kepada pihak komersial mana pun. Sistem beroperasi semata-mata sebagai platform pencatatan internal, persiapan pelaporan SPT Masa Unifikasi, serta rekonsiliasi kas BOS bersama instansi pembina (Dinas Pendidikan & Kemenkeu).
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
