"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { FileText, Send, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BuatPermohonanLayananAdminPage() {
  const router = useRouter();
  const { schoolProfile, addServiceRequest, showToast } = useApp();
  const [serviceType, setServiceType] = useState("Surat Keterangan Fiskal (SKF) Sekolah");
  const [notes, setNotes] = useState("Permohonan SKF untuk persyaratan pencairan dana hibah dan verifikasi kepatuhan BOS");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addServiceRequest({
      type: "ADMINISTRASI",
      title: serviceType,
      category: "Layanan Administrasi Perpajakan",
      applicantName: schoolProfile.principalName || "DR. H. SURYADI, M.PD",
      npwp: schoolProfile.taxId || "9988770000010609",
      status: "DALAM_PROSES",
      progressPercent: 30,
      currentStep: "Verifikasi Kelengkapan Berkas oleh Seksi Pelayanan KPP",
      notes,
    });

    showToast({
      type: "success",
      title: "Permohonan Layanan Diterima",
      description: `Permohonan "${serviceType}" berhasil diajukan dengan Tiket ${created.ticketNumber}.`
    });

    router.push("/layanan/dalam-proses");
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Buat Permohonan Layanan Administrasi" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Buat Permohonan Layanan Administrasi</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pengajuan surat keterangan fiskal, permohonan SKB, dan administrasi perpajakan sekolah</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jenis Layanan Administrasi Dimohonkan
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-semibold outline-none"
              >
                <option value="Surat Keterangan Fiskal (SKF) Sekolah">Surat Keterangan Fiskal (SKF) Sekolah</option>
                <option value="Surat Keterangan Bebas (SKB) PPh Yayasan">Surat Keterangan Bebas (SKB) PPh Yayasan</option>
                <option value="Permohonan Legalisasi Dokumen Faktur/Bupot">Permohonan Legalisasi Dokumen Faktur/Bupot</option>
                <option value="Permohonan Surat Keterangan Wajib Pajak Nonaktif">Permohonan Surat Keterangan Wajib Pajak Nonaktif</option>
                <option value="Permohonan Penegasan Status Wajib Pajak Pendidikan">Permohonan Penegasan Status Wajib Pajak Pendidikan</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Satuan Pendidikan / Wajib Pajak
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
                  NPWP 16 Digit
                </label>
                <input
                  type="text"
                  disabled
                  value={schoolProfile.taxId}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Keterangan & Keperluan Pengajuan Permohonan
              </label>
              <textarea
                rows={3}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Permohonan ke KPP</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
