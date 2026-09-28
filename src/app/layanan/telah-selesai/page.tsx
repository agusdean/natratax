"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, Download, Eye, FileText, X } from "lucide-react";
import { ServiceRequest } from "@/types";

export default function PermohonanTelahSelesaiPage() {
  const { serviceRequests, schoolProfile, showToast } = useApp();
  const [selectedCompleted, setSelectedCompleted] = useState<ServiceRequest | null>(null);

  const completed = serviceRequests.filter((r) => r.status === "SELESAI");

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Permohonan Telah Selesai" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Permohonan Telah Selesai</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Arsip permohonan layanan administrasi yang telah disetujui dan terbit surat keputusan ({completed.length} berkas)</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {completed.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              Belum ada permohonan yang diselesaikan.
            </div>
          ) : (
            completed.map((c) => (
              <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{c.ticketNumber}</span>
                    <span className="text-xs text-slate-400">Diajukan pada {c.dateSubmitted}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{c.notes || c.currentStep}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setSelectedCompleted(c)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Bukti</span>
                  </button>
                  <button
                    onClick={() => showToast({ type: "success", title: "Unduh Dokumen", description: `Surat Keterangan ${c.ticketNumber}.pdf berhasil diunduh.` })}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh SK</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Tanda Terima */}
        {selectedCompleted && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Bukti Penerimaan Elektronik (BPE) Selesai</h3>
                </div>
                <button onClick={() => setSelectedCompleted(null)} className="p-1 hover:bg-slate-100 rounded">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-slate-400">Nomor BPE:</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedCompleted.bpeNumber || "BPE-2026-001"}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-slate-400">Nomor Tiket:</span>
                  <span className="font-mono font-bold">{selectedCompleted.ticketNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-slate-400">Subjek:</span>
                  <span className="font-semibold">{selectedCompleted.title}</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-600">SELESAI (100%)</span>
                </div>
                <div className="py-2 text-slate-600 dark:text-slate-300">
                  <span className="block font-bold mb-1">Catatan Verifikasi Fiskus:</span>
                  <p className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200">{selectedCompleted.notes || selectedCompleted.currentStep}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedCompleted(null)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
