"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Building2, Plus, Download, CheckCircle2 } from "lucide-react";

export default function PbbP5lPage() {
  const { showToast } = useApp();
  const objects = [
    {
      nop: "31.75.080.005.012-0045.0",
      name: "Gedung Kampus A & Laboratorium Praktik Kejuruan",
      location: "Jl. Pendidikan No. 45, Duren Sawit, Jakarta Timur",
      landArea: "4.850 m²",
      buildingArea: "3.200 m²",
      njop: "Rp 24.500.000.000",
      status: "OBJEK PAJAK SEKOLAH (BEBAS PBB)"
    },
    {
      nop: "31.75.080.005.012-0046.0",
      name: "Gedung Bengkel Otomotif & Teaching Factory SMK",
      location: "Jl. Pendidikan No. 47, Duren Sawit, Jakarta Timur",
      landArea: "2.100 m²",
      buildingArea: "1.800 m²",
      njop: "Rp 12.800.000.000",
      status: "OBJEK PAJAK SEKOLAH (BEBAS PBB)"
    }
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/dashboard" },
        { label: "PBB P5L" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Pendaftaran & Data Objek Pajak PBB P5L
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pengelolaan Nomor Objek Pajak (NOP) Bumi & Bangunan Sarana Pendidikan SMK
              </p>
            </div>
          </div>

          <button
            onClick={() => showToast({ type: "info", title: "Tambah Objek PBB", description: "Formulir pendaftaran NOP sarpras dibuka." })}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daftar Objek Pajak Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {objects.map((obj, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400">{obj.nop}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {obj.status}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{obj.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{obj.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Luas Tanah / Bangunan:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{obj.landArea} / {obj.buildingArea}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Nilai NJOP:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{obj.njop}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
