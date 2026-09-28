"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Trash2, AlertTriangle, Send } from "lucide-react";

export default function PenghapusanPencabutanPage() {
  const { schoolProfile, showToast } = useApp();
  const [requestType, setRequestType] = useState("Pencabutan Pengukuhan PKP Unit Tidak Aktif");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: "success",
      title: "Permohonan Dikirim",
      description: `Permohonan "${requestType}" telah terkirim ke KPP untuk proses verifikasi fiskal.`
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/dashboard" },
        { label: "Penghapusan & Pencabutan" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Penghapusan NPWP & Pencabutan Pengukuhan PKP
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pengajuan resmi pembubaran unit usaha, pemindahan hak, atau deregistrasi fasilitas pajak
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="p-3 mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <p>
              Perhatian: Permohonan penghapusan NPWP / pencabutan PKP memerlukan pemeriksaan menyeluruh terhadap seluruh rekonsiliasi kas BOS, pelaporan SPT masa lalu, dan pelunasan sisa utang pajak.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jenis Permohonan
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="Pencabutan Pengukuhan PKP Unit Tidak Aktif">Pencabutan Pengukuhan PKP Unit Tidak Aktif</option>
                <option value="Penghapusan Nomor Objek Pajak (NOP) Bangunan Lama">Penghapusan Nomor Objek Pajak (NOP) Bangunan Lama</option>
                <option value="Pencabutan Sertifikat Elektronik Lama">Pencabutan Sertifikat Elektronik Lama</option>
                <option value="Penetapan Wajib Pajak Non-Efektif (NE)">Penetapan Wajib Pajak Non-Efektif (NE)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alasan & Keterangan Pendukung
              </label>
              <textarea
                required
                rows={4}
                placeholder="Jelaskan alasan pengajuan dan lampirkan referensi berita acara penutupan / rekonstruksi sarpras..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Permohonan Pencabutan</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
