"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { ShieldAlert, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BuatPengaduanPage() {
  const router = useRouter();
  const { schoolProfile, addServiceRequest, showToast } = useApp();
  const [category, setCategory] = useState<"PENGADUAN" | "SARAN" | "APRESIASI">("PENGADUAN");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addServiceRequest({
      type: "PENGADUAN",
      title: subject,
      category: category,
      applicantName: schoolProfile.principalName || "DR. H. SURYADI, M.PD",
      npwp: schoolProfile.taxId || "9988770000010609",
      status: "DALAM_PROSES",
      progressPercent: 20,
      currentStep: "Diteruskan ke Unit Kepatuhan Internal KPP",
      notes: content,
    });

    showToast({
      type: "success",
      title: `${category} Berhasil Dikirim`,
      description: `Laporan Anda telah tercatat dengan nomor tiket ${created.ticketNumber}.`
    });

    router.push("/layanan/daftar-pengaduan");
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Buat Pengaduan, Saran, Dan Apresiasi" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Pengaduan, Saran, Dan Apresiasi</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Saluran resmi penyampaian masukan, pengaduan pelayanan fiskal, dan apresiasi petugas pajak</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Kategori Masukan</label>
              <div className="flex gap-3">
                {(["PENGADUAN", "SARAN", "APRESIASI"] as const).map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                      category === cat
                        ? "bg-[#381750] text-white shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subjek / Judul Laporan
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Apresiasi Respons Cepat Helpdesk Perpajakan BOS"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Isi Uraian Laporan Secara Rinci
              </label>
              <textarea
                rows={5}
                required
                placeholder="Tuliskan pengalaman, masukan teknis, atau apresiasi secara detail..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none font-medium leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Masukan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
