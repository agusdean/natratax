"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Video, Play, Clock, CheckCircle2 } from "lucide-react";

export default function ELearningPajakPage() {
  const { showToast } = useApp();
  const courses = [
    { title: "Simulasi Coretax: Pembuatan Faktur Pajak Keluaran & Masukan", duration: "45 Menit", modules: "6 Video Tutorial", progress: "100%" },
    { title: "Tata Cara Pembuatan Bukti Potong BP 21 Guru Honorer & BPPU", duration: "35 Menit", modules: "4 Video Tutorial", progress: "80%" },
    { title: "Kompilasi SPT Masa Unifikasi & Pembayaran Melalui Kode Billing", duration: "50 Menit", modules: "5 Video Tutorial", progress: "60%" },
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Materi E-Learning" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-md">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Materi E-Learning & Video Pembelajaran</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kelas daring mandiri interaktif seputar administrasi perpajakan Coretax</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((c, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-full h-32 rounded-lg bg-gradient-to-tr from-purple-900 to-indigo-700 text-white flex items-center justify-center relative overflow-hidden group cursor-pointer">
                  <Play className="w-10 h-10 text-white/90 group-hover:scale-110 transition-transform" />
                  <span className="absolute bottom-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-mono">{c.duration}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h3>
                <p className="text-xs text-slate-400">{c.modules}</p>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Progres Belajar:</span>
                  <span className="font-bold text-indigo-600">{c.progress}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: c.progress }} />
                </div>
                <button
                  onClick={() => showToast({ type: "info", title: "Membuka Video", description: `Memutar modul ${c.title}...` })}
                  className="w-full mt-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs"
                >
                  Lanjutkan Belajar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
