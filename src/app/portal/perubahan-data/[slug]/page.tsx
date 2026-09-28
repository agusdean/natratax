"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { useParams } from "next/navigation";
import { Edit3, CheckCircle2, Send, Building2, User } from "lucide-react";

export default function PerubahanDataSlugPage() {
  const params = useParams();
  const slug = params?.slug as string || "identitas";
  const { schoolProfile, showToast } = useApp();

  const getPageInfo = () => {
    switch (slug) {
      case "alamat":
        return {
          title: "Perubahan Alamat Utama",
          desc: "Pemutakhiran data alamat domisili kampus, kontak resmi, dan lokasi fisik sekolah.",
          fieldLabel: "Alamat Lengkap Satuan Pendidikan",
          initialValue: schoolProfile.address,
        };
      case "pbb":
        return {
          title: "Perubahan Data Objek Pajak PBB P5L",
          desc: "Penyesuaian luas tanah, luas bangunan, dan zonasi NJOP objek sarana pendidikan.",
          fieldLabel: "Keterangan Pemutakhiran Objek PBB",
          initialValue: "Pembangunan Gedung Praktik Kejuruan Baru seluas 650 m².",
        };
      case "pmse":
        return {
          title: "Perubahan Data Pemungut PPN PMSE",
          desc: "Pengelolaan data penunjukan pemungutan PPN Perdagangan Melalui Sistem Elektronik.",
          fieldLabel: "Nomor Keputusan Dirjen Pajak (Kepdirjen)",
          initialValue: "KEP-218/PJ/2026 tentang Penunjukan Pemungut PPN PMSE Layanan Edukasi Digital",
        };
      case "identitas":
      default:
        return {
          title: "Perubahan Identitas Wajib Pajak",
          desc: "Perubahan nama instansi sekolah, bentuk badan hukum yayasan, dan klasifikasi lapangan usaha (KLU).",
          fieldLabel: "Nama Resmi Wajib Pajak / Sekolah",
          initialValue: schoolProfile.name,
        };
    }
  };

  const info = getPageInfo();
  const [val, setVal] = useState(info.initialValue);
  const { updateSchoolProfile, addServiceRequest } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (slug === "alamat") {
      updateSchoolProfile({ address: val });
    } else if (slug === "identitas") {
      updateSchoolProfile({ name: val });
    }
    addServiceRequest({
      type: "PERUBAHAN_DATA",
      title: `${info.title}`,
      category: "Perubahan Data Wajib Pajak",
      applicantName: schoolProfile.principalName || "DR. H. SURYADI, M.PD",
      npwp: schoolProfile.taxId || "9988770000010609",
      status: "SELESAI",
      progressPercent: 100,
      currentStep: "Data Profil Berhasil Disinkronisasi ke Master Coretax",
      notes: `Perubahan ${info.fieldLabel} menjadi: ${val}`
    });
    showToast({
      type: "success",
      title: "Perubahan Berhasil Disimpan",
      description: `Data pada formulir "${info.title}" telah diperbarui dan disinkronkan ke profil sekolah.`
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/dashboard" },
        { label: "Perubahan Data", href: "/dashboard" },
        { label: info.title }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{info.title}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{info.desc}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                NPWP / NITKU Instansi Sekolah
              </label>
              <input
                type="text"
                disabled
                value={schoolProfile.taxId || schoolProfile.npwp16 || "9988770000010609"}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-slate-700 dark:text-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {info.fieldLabel}
              </label>
              <textarea
                rows={4}
                required
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan Pemutakhiran Data</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
