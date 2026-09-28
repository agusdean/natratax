"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Clock, CheckCircle2, Eye, X, FileText, Download } from "lucide-react";
import { ServiceRequest } from "@/types";

export default function PermohonanDalamProsesPage() {
  const { serviceRequests, updateServiceRequestStatus, showToast } = useApp();
  const [selectedReq, setSelectedReq] = useState<ServiceRequest | null>(null);

  const activeRequests = serviceRequests.filter(
    (r) => r.status === "DALAM_PROSES" || r.status === "MENUNGGU"
  );

  const handleSimulateFinish = (id: string) => {
    updateServiceRequestStatus(id, "SELESAI", "Layanan Administrasi Selesai Diproses", "Surat Keterangan / Keputusan telah diterbitkan secara elektronik.");
    setSelectedReq(null);
    showToast({
      type: "success",
      title: "Permohonan Selesai Diproses",
      description: "Berkas telah berstatus SELESAI dan dapat diunduh di Permohonan Telah Selesai."
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Permohonan Dalam Proses" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Permohonan Dalam Proses</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Status penelaahan permohonan layanan administrasi oleh KPP Pratama ({activeRequests.length} berkas aktif)</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {activeRequests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              Tidak ada permohonan yang sedang dalam proses saat ini.
            </div>
          ) : (
            activeRequests.map((r) => (
              <div key={r.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">{r.ticketNumber}</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{r.title}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 w-fit">
                    {r.currentStep}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progres Verifikasi</span>
                    <span className="font-bold text-slate-900 dark:text-white">{r.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${r.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div>Tanggal Pengajuan: <span className="font-semibold text-slate-700 dark:text-slate-300">{r.dateSubmitted}</span></div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedReq(r)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail & Tindak Lanjut</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Tindak Lanjut */}
        {selectedReq && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Detail Permohonan Dalam Proses</h3>
                </div>
                <button onClick={() => setSelectedReq(null)} className="p-1 hover:bg-slate-100 rounded">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div><span className="text-slate-400">Nomor Tiket:</span> <span className="font-mono font-bold text-amber-600">{selectedReq.ticketNumber}</span></div>
                <div><span className="text-slate-400">Judul Layanan:</span> <span className="font-semibold">{selectedReq.title}</span></div>
                <div><span className="text-slate-400">Tahap Terkini:</span> <span className="font-semibold">{selectedReq.currentStep}</span></div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-slate-600 dark:text-slate-300">
                  <span className="block font-bold mb-1">Catatan Pengajuan:</span>
                  {selectedReq.notes || "Berkas telah diunggah dan memenuhi syarat formal."}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => handleSimulateFinish(selectedReq.id)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesaikan & Terbitkan Surat</span>
                </button>
                <button
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold"
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
