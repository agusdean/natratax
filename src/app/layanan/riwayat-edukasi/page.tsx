"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { BookOpen, CheckCircle2, Download } from "lucide-react";

export default function RiwayatEdukasiPage() {
  const { showToast } = useApp();
  const history = [
    {
      date: "2026-09-10",
      title: "Sosialisasi Implementasi Coretax DJP bagi SMK & Satuan Pendidikan",
      speaker: "Tim Penyuluh KPP Pratama Jakarta",
      attendees: "38 Guru & Tenaga Kependidikan",
      status: "SELESAI (SERTIFIKAT TERBIT)",
    },
    {
      date: "2026-08-22",
      title: "Bimtek Tata Cara Pemotongan PPh Unifikasi & Bukti Potong BOS",
      speaker: "Account Representative (AR) Pengawasan",
      attendees: "Bendahara & Staf Tata Usaha",
      status: "SELESAI (SERTIFIKAT TERBIT)",
    },
    {
      date: "2026-07-15",
      title: "Workshop Pemadanan NIK ke NPWP 16 Digit dan Akun DJP Online",
      speaker: "Fungsional Penyuluh Kanwil DJP Jakarta",
      attendees: "Seluruh Pendidik & Tenaga Kependidikan",
      status: "SELESAI",
    }
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Riwayat Edukasi" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Edukasi Perpajakan</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daftar kegiatan bimtek, sosialisasi Coretax, dan sertifikat pelatihan pajak sekolah</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {history.map((h, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{h.date}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {h.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{h.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Narasumber: {h.speaker} • Peserta: {h.attendees}</p>
              </div>

              <button
                onClick={() => showToast({ type: "success", title: "Unduh Sertifikat", description: `Mengunduh sertifikat kegiatan ${h.title}...` })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs shrink-0 self-end md:self-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Sertifikat</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
