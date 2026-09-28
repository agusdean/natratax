"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Activity, Clock, ShieldCheck, CheckCircle2, User } from "lucide-react";

export default function ActivitiesPage() {
  const { auditLogs, currentUser } = useApp();

  const userLogs = auditLogs.filter(
    (l) => l.userName === currentUser.name || currentUser.role === "SUPER ADMIN" || currentUser.role === "BENDAHARA"
  );

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/dashboard" },
        { label: "Aktivitas Saya" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Riwayat Aktivitas & Sesi Kerja
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log kronologis tindakan yang dilakukan oleh <strong>{currentUser.name}</strong> ({currentUser.role})
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Activities */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {userLogs.map((log) => (
              <div key={log.id} className="relative flex items-start gap-4 pl-8 group">
                <div className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900 shadow-xs" />
                <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-100 dark:border-slate-700/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {log.module} — {log.action}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {log.recordIdentifier}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {log.timestamp} WIB
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {log.details}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>IP: {log.ipAddress}</span>
                    <span>Pengguna: {log.userName} ({log.userRole})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
