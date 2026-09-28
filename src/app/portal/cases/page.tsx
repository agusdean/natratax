"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Briefcase, Clock, CheckCircle2, ChevronRight, Plus, Search, Eye, X, FileText, Download } from "lucide-react";
import { ServiceRequest } from "@/types";

export default function KasusSayaPage() {
  const { serviceRequests, addServiceRequest, schoolProfile, showToast } = useApp();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<ServiceRequest | null>(null);

  // Form state
  const [caseTitle, setCaseTitle] = useState("Klarifikasi SP2DK Penyesuaian Pajak Belanja Sarpras BOS");
  const [caseCategory, setCaseCategory] = useState("Klarifikasi SP2DK / Pengawasan");
  const [caseNotes, setCaseNotes] = useState("Penjelasan atas perbedaan pelaporan faktur pajak masukan belanja BOS Triwulan 3 telah sesuai dengan dokumen BAST dan kwitansi.");

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addServiceRequest({
      type: "ADMINISTRASI",
      title: caseTitle,
      category: caseCategory,
      applicantName: schoolProfile.principalName || "DR. H. SURYADI, M.PD",
      npwp: schoolProfile.taxId || "9988770000010609",
      status: "DALAM_PROSES",
      progressPercent: 35,
      currentStep: "Penelitian Dokumen Penjelasan Wajib Pajak di Seksi Pengawasan",
      notes: caseNotes,
    });
    setIsCreateOpen(false);
    showToast({
      type: "success",
      title: "Kasus Berhasil Didaftarkan",
      description: `Tiket penanganan ${created.ticketNumber} tercatat pada sistem pengawasan.`
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/dashboard" },
        { label: "Kasus Saya" }
      ]}
    >
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Daftar Kasus Perpajakan</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Riwayat pengawasan, klarifikasi SP2DK, dan administrasi kasus wajib pajak</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Kasus / Klarifikasi Baru</span>
          </button>
        </div>

        <div className="space-y-3">
          {serviceRequests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              Tidak ada berkas kasus perpajakan aktif.
            </div>
          ) : (
            serviceRequests.map((c) => (
              <div key={c.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400">{c.ticketNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === "SELESAI" 
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}>
                      {c.status.replace("_", " ")}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">• Diajukan: {c.dateSubmitted}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{c.category} • Pemohon: {c.applicantName}</p>
                  
                  {/* Progress bar */}
                  <div className="pt-1">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>{c.currentStep}</span>
                      <span className="font-bold">{c.progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          c.status === "SELESAI" ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${c.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {c.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                      {c.notes}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => setSelectedCase(c)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Berkas & BPE</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Buat Kasus Baru */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-[#381750] text-white">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm">Pendaftaran Kasus / Klarifikasi Perpajakan</h3>
                </div>
                <button onClick={() => setIsCreateOpen(false)} className="p-1 hover:bg-white/10 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Judul Kasus / Permohonan Klarifikasi
                  </label>
                  <input
                    type="text"
                    required
                    value={caseTitle}
                    onChange={(e) => setCaseTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Klasifikasi Kasus
                  </label>
                  <select
                    value={caseCategory}
                    onChange={(e) => setCaseCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium"
                  >
                    <option value="Klarifikasi SP2DK / Pengawasan">Klarifikasi SP2DK / Pengawasan</option>
                    <option value="Integrasi Basis Data Coretax">Integrasi Basis Data Coretax</option>
                    <option value="Permohonan Penjelasan Teknis BOS">Permohonan Penjelasan Teknis BOS</option>
                    <option value="Pemeriksaan Rutin Kepatuhan Penyetoran">Pemeriksaan Rutin Kepatuhan Penyetoran</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Uraian Penjelasan / Alasan Permohonan
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={caseNotes}
                    onChange={(e) => setCaseNotes(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold cursor-pointer"
                  >
                    Kirim & Daftarkan Kasus
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detail & BPE */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Bukti Penerimaan Elektronik (BPE) Kasus</h3>
                </div>
                <button onClick={() => setSelectedCase(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-2 text-xs border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Nomor Tanda Terima BPE:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedCase.bpeNumber || "BPE-KPP-202609-001"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Nomor Berkas Tiket:</span>
                  <span className="font-mono font-bold">{selectedCase.ticketNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Wajib Pajak:</span>
                  <span className="font-semibold">{schoolProfile.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">NPWP 16 Digit:</span>
                  <span className="font-mono font-semibold">{selectedCase.npwp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Tanggal Pengajuan:</span>
                  <span>{selectedCase.dateSubmitted}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">Status Penelaahan:</span>
                  <span className="font-bold text-amber-600">{selectedCase.status} ({selectedCase.progressPercent}%)</span>
                </div>
                <div className="pt-2 text-slate-600 dark:text-slate-300">
                  <span className="block font-bold text-[11px] mb-1">Tahap Aktif:</span>
                  <p className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">{selectedCase.currentStep}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => showToast({ type: "success", title: "Unduh Dokumen BPE", description: `BPE ${selectedCase.ticketNumber}.pdf berhasil diunduh.` })}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Cetak Tanda Terima PDF</span>
                </button>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
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
