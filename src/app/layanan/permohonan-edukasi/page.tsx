"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Send, Users, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PermohonanEdukasiPage() {
  const router = useRouter();
  const { schoolProfile, addServiceRequest, showToast } = useApp();
  const [topic, setTopic] = useState("Sosialisasi Pajak Dana BOS & Pembukuan Coretax untuk Guru & Tata Usaha");
  const [targetAudience, setTargetAudience] = useState("Guru Produktif, Bendahara, dan Staf Keuangan");
  const [proposedDate, setProposedDate] = useState("2026-10-20");
  const [attendeeCount, setAttendeeCount] = useState(45);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addServiceRequest({
      type: "EDUKASI",
      title: topic,
      category: "Permohonan Edukasi & Bimtek",
      applicantName: schoolProfile.principalName || "DR. H. SURYADI, M.PD",
      npwp: schoolProfile.taxId || "9988770000010609",
      status: "DALAM_PROSES",
      progressPercent: 25,
      currentStep: "Penjadwalan Tim Fungsional Penyuluh KPP",
      notes: `Target: ${targetAudience} (${attendeeCount} peserta). Usulan Tanggal: ${proposedDate}`,
    });

    showToast({
      type: "success",
      title: "Permohonan Edukasi Terkirim",
      description: `Permohonan narasumber penyuluhan pajak tercatat dengan tiket ${created.ticketNumber}.`
    });

    router.push("/layanan/daftar-permohonan-edukasi");
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Penyampaian Permohonan Edukasi" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Penyampaian Permohonan Edukasi</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pengajuan narasumber penyuluh perpajakan resmi untuk bimtek internal sekolah</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Topik Edukasi yang Dimohon</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Sasaran Peserta Bimtek</label>
                <input
                  type="text"
                  required
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Estimasi Jumlah Peserta (Orang)</label>
                <input
                  type="number"
                  required
                  min={5}
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Usulan Tanggal Pelaksanaan</label>
                <input
                  type="date"
                  required
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Lokasi Pelaksanaan</label>
                <input
                  type="text"
                  disabled
                  value={schoolProfile.name + " (Aula / Lab Komputer)"}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium text-slate-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Permohonan Edukasi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
