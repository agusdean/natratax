"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Bell, CheckCircle2, AlertTriangle, FileText, Clock } from "lucide-react";

export default function NotifikasiSayaPage() {
  const { notifications, markAllNotificationsRead } = useApp();

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/dashboard" },
        { label: "Notifikasi Saya" }
      ]}
    >
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Kotak Masuk Notifikasi</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pesan sistem, batas waktu pelaporan SPT, dan konfirmasi pembayaran</p>
            </div>
          </div>
          <button
            onClick={markAllNotificationsRead}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
          >
            Tandai Semua Dibaca
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
          {notifications.map((n) => (
            <div key={n.id} className={`p-4 flex items-start gap-3 transition-colors ${!n.isRead ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''}`}>
              <div className="mt-0.5">
                {n.category === 'APPROVAL' && <Clock className="w-5 h-5 text-amber-500" />}
                {n.category === 'TAX' && <FileText className="w-5 h-5 text-indigo-500" />}
                {n.category === 'DEADLINE' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                {n.category === 'INFO' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h4>
                  <span className="text-xs text-slate-400">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
