"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Clock, Eye, CheckCircle2, X, Download, FileText } from "lucide-react";
import { ServiceRequest } from "@/types";

export default function KasusBerjalanSayaPage() {
  const { serviceRequests, updateServiceRequestStatus, showToast } = useApp();
  const [selectedCase, setSelectedCase] = useState<ServiceRequest | null>(null);

  const activeCases = serviceRequests.filter(
    (c) => c.status === "DALAM_PROSES" || c.status === "MENUNGGU"
  );

  const handleSimulateApproval = (id: string) => {
    updateServiceRequestStatus(id, "SELESAI", "Selesai ditelaah & Surat Keterangan Diterbitkan", "Seluruh persyaratan teknis dan dokumen pendukung dinyatakan sah.");
    setSelectedCase(null);
    showToast({
      type: "success",
      title: "Permohonan Berhasil Disetujui",
      description: "Kasus telah dituntaskan dan berpindah ke status SELESAI."
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/dashboard" },
        { label: "Kasus Berjalan Saya" }
      ]}
    >
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Kasus Berjalan Saya</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kasus dan permohonan perpajakan aktif dalam proses penelaahan ({activeCases.length} aktif)</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {activeCases.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              Tidak ada kasus atau permohonan yang sedang berjalan saat ini.
            </div>
          ) : (
            activeCases.map((c) => (
              <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">{c.ticketNumber}</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{c.title}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 w-fit">
                    {c.currentStep}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progres Penelaahan</span>
                    <span className="font-bold text-slate-900 dark:text-white">{c.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${c.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div>Diajukan Pada: <span className="font-semibold text-slate-700 dark:text-slate-300">{c.dateSubmitted}</span></div>
                  <div>Penanggung Jawab: <span className="font-semibold text-slate-700 dark:text-slate-300">{c.applicantName}</span></div>
                </div>

                {c.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
                    {c.notes}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setSelectedCase(c)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Detail & Tindak Lanjut</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Tindak Lanjut */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Tindak Lanjut Kasus Aktif</h3>
                </div>
                <button onClick={() => setSelectedCase(null)} className="p-1 hover:bg-slate-100 rounded">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div><span className="text-slate-400">Nomor Berkas:</span> <span className="font-mono font-bold text-amber-600">{selectedCase.ticketNumber}</span></div>
                <div><span className="text-slate-400">Judul Kasus:</span> <span className="font-semibold">{selectedCase.title}</span></div>
                <div><span className="text-slate-400">Tahap Terkini:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedCase.currentStep}</span></div>
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-slate-600 dark:text-slate-300">
                  <span className="block font-bold mb-1">Catatan Penelaahan Petugas:</span>
                  {selectedCase.notes || "Berkas sedang dalam antrian penelaahan oleh tim fiskus."}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => handleSimulateApproval(selectedCase.id)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesaikan & Terbitkan SK</span>
                </button>
                <button
                  onClick={() => setSelectedCase(null)}
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
