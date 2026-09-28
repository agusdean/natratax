"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { CalendarClock, MapPin, Users, Video } from "lucide-react";

export default function JadwalEdukasiPage() {
  const { showToast } = useApp();
  const schedules = [
    {
      title: "Webinar Nasional: Transformasi Coretax DJP pada Pengelolaan Dana BOS & Hibah",
      date: "05 Oktober 2026",
      time: "09:00 - 12:00 WIB",
      type: "ONLINE (ZOOM & YOUTUBE LIVE)",
      speaker: "Direktorat Penyuluhan, Pelayanan, dan Humas DJP",
      quota: "Tersisa 120 Kursi"
    },
    {
      title: "Workshop Luring: Tata Cara Pengisian e-Faktur 4.0 bagi Unit Teaching Factory SMK",
      date: "12 Oktober 2026",
      time: "08:30 - 15:30 WIB",
      type: "TATAP MUKA (AULA KANWIL DJP JAKARTA)",
      speaker: "Tim Fungsional Penyuluh Perpajakan",
      quota: "Tersisa 15 Kursi"
    }
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Jadwal Kegiatan Edukasi" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Jadwal Kegiatan Edukasi Perpajakan</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kalender pelatihan, seminar, dan sosialisasi perpajakan resmi Direktorat Jenderal Pajak</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {schedules.map((s, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {s.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{s.date} • {s.time}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{s.title}</h3>
                <p className="text-xs text-slate-500">Narasumber: {s.speaker}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-emerald-600">{s.quota}</span>
                <button
                  onClick={() => showToast({ type: "success", title: "Pendaftaran Berhasil", description: `Bapak/Ibu terdaftar pada "${s.title}". Tautan Zoom/Akses dikirimkan ke email sekolah.` })}
                  className="px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
                >
                  Daftar Kegiatan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
