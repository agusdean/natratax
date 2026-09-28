"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { FileEdit, Plus, Trash2, ArrowRight } from "lucide-react";

export default function PermohonanBelumDisampaikanPage() {
  const { showToast } = useApp();
  const drafts = [
    {
      id: "DRAFT-ADM-01",
      title: "Draft Permohonan Pembaruan NOP Objek Pajak Lab Bengkel",
      date: "2026-09-25",
      type: "Objek PBB Sarana",
      status: "DRAFT BELUM TERKIRIM"
    }
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Permohonan Belum Disampaikan" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow-md">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Permohonan Belum Disampaikan (Draft)</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daftar berkas permohonan layanan yang masih tersimpan sebagai konsep</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {drafts.map((d) => (
            <div key={d.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">{d.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{d.status}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{d.title}</h3>
                <p className="text-xs text-slate-500">{d.type} • Disimpan pada {d.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast({ type: "info", title: "Lanjutkan Pengisian", description: `Membuka formulir ${d.id}...` })}
                  className="px-3.5 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs"
                >
                  Lanjutkan & Kirim
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
