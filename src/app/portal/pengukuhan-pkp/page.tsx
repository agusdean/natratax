"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, Building2, FileCheck2, FileText, Send } from "lucide-react";

export default function PengukuhanPkpPage() {
  const { schoolProfile, showToast } = useApp();
  const [formData, setFormData] = useState({
    businessType: "Teaching Factory & Jasa Pelatihan Kerja SMK",
    estimatedOmzet: "450000000",
    kluCode: "85220 - Pendidikan Menengah Kejuruan Swasta",
    location: "Kampus Utama SMK Bina Putra Jakarta"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: "success",
      title: "Permohonan PKP Diterima",
      description: "Permohonan pengukuhan PKP Unit Usaha SMK telah terdaftar dengan Tanda Terima Elektronik (BPE)."
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/dashboard" },
        { label: "Pengukuhan PKP" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Pengukuhan Pengusaha Kena Pajak (PKP)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pendaftaran & Pengelolaan Status PKP Unit Produksi / Teaching Factory SMK
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 w-fit">
            STATUS: PKP DIKUKUHKAN
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            Data Pengukuhan PKP Satuan Pendidikan
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Wajib Pajak / Badan
                </label>
                <input
                  type="text"
                  disabled
                  value={schoolProfile.name}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-bold text-slate-700 dark:text-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Pokok Wajib Pajak (NPWP 16)
                </label>
                <input
                  type="text"
                  disabled
                  value={schoolProfile.taxId || schoolProfile.npwp16 || "9988770000010609"}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Klasifikasi Lapangan Usaha (KLU)
                </label>
                <input
                  type="text"
                  value={formData.kluCode}
                  onChange={(e) => setFormData({ ...formData, kluCode: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Perkiraan Omzet Tahunan Usaha (Rp)
                </label>
                <input
                  type="number"
                  value={formData.estimatedOmzet}
                  onChange={(e) => setFormData({ ...formData, estimatedOmzet: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Aktivitas Usaha & Lokasi Layanan
              </label>
              <textarea
                rows={3}
                value={formData.businessType + " - " + formData.location}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan Perubahan Data PKP</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
