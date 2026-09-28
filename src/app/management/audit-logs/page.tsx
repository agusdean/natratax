"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { ShieldAlert, Search, ShieldCheck, Download, Lock } from "lucide-react";
import { ExportModal } from "@/components/features/ExportModal";

export default function AuditLogsPage() {
  const { auditLogs, isCompactMode } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.recordIdentifier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Manajemen", href: "/management/users" },
        { label: "Audit Trail" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Audit Trail & Log Aktivitas Sistem
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Catatan keaslian forensik finansial SMK BINA PUTRA JAKARTA (Immutable Append-Only Log)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border border-slate-300 dark:border-slate-700">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Log Terkunci & Tidak Dapat Dihapus
            </span>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300"
              title="Ekspor Audit"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audit Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari aksi, pengguna, nomor rek..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {filteredLogs.length} Entri Audit Terverifikasi
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isCompactMode ? "compact-table" : ""}`}>
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Waktu (WIB)</th>
                  <th className="py-3 px-4">Pengguna & Peran</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                  <th className="py-3 px-4">Modul</th>
                  <th className="py-3 px-4">ID Rekord</th>
                  <th className="py-3 px-4">Rincian Perubahan / Mutasi</th>
                  <th className="py-3 px-4 text-right">Alamat IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{log.userName}</div>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{log.userRole}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        log.action === "APPROVE"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : log.action === "CREATE"
                          ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                          : log.action === "LOGIN"
                          ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300">
                      {log.module}
                    </td>
                    <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      {log.recordIdentifier}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-sm">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400 text-[11px]">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Buku Catatan Audit Forensik Sistem"
        rowCount={filteredLogs.length}
        currentFilterText="Semua Modul Terkunci"
      />
    </AppShell>
  );
}
