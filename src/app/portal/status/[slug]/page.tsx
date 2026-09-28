"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { useParams } from "next/navigation";
import { UserCheck, ShieldCheck, CheckCircle2, Send, AlertTriangle } from "lucide-react";

export default function PerubahanStatusSlugPage() {
  const params = useParams();
  const slug = params?.slug as string || "nonaktif";
  const { schoolProfile, currentUser, showToast } = useApp();

  const getStatusInfo = () => {
    switch (slug) {
      case "pengaktifan":
        return {
          title: "Pengaktifan Kembali Wajib Pajak Nonaktif",
          desc: "Permohonan pengaktifan kembali status aktif NPWP dan pelaporan pajak berkala satuan pendidikan.",
          actionText: "Ajukan Pengaktifan Kembali NPWP",
        };
      case "pemungut-meterai":
        return {
          title: "Penetapan Pemungut Bea Meterai",
          desc: "Pendaftaran dan pemungutan bea meterai atas kuitansi pembayaran dan dokumen resmi sekolah.",
          actionText: "Daftar Pemungut Bea Meterai",
        };
      case "pencabutan-meterai":
        return {
          title: "Pencabutan Pemungut Bea Meterai",
          desc: "Pencabutan status kewajiban pemungut bea meterai instansi sekolah.",
          actionText: "Ajukan Pencabutan Pemungut Meterai",
        };
      case "penunjukan-kuasa":
        return {
          title: "Penunjukan Wakil / Kuasa Wajib Pajak",
          desc: "Penetapan surat kuasa khusus kepada pengelola keuangan atau konsultan pajak resmi sekolah.",
          actionText: "Tetapkan Kuasa Wajib Pajak",
        };
      case "perubahan-kuasa":
        return {
          title: "Perubahan Data Wakil / Kuasa Wajib Pajak",
          desc: "Pemutakhiran identitas wakil kuasa, nomor surat kuasa, dan wewenang penandatanganan berkas.",
          actionText: "Perbarui Data Kuasa",
        };
      case "pencabutan-kuasa":
        return {
          title: "Pencabutan Wakil / Kuasa",
          desc: "Pencabutan surat kuasa perpajakan atas berakhirnya masa penugasan perwakilan.",
          actionText: "Cabut Surat Kuasa",
        };
      case "penunjukan-pemotong":
        return {
          title: "Penunjukan Pemotong Atau Pemungut PPh/PPN",
          desc: "Penetapan bendahara satuan pendidikan sebagai pemotong resmi PPh Pasal 21, 22, 23, dan PPN.",
          actionText: "Simpan Penunjukan Pemotong",
        };
      case "pencabutan-pemotong":
        return {
          title: "Pencabutan Pemotong Atau Pemungut PPh/PPN",
          desc: "Pencabutan status kewajiban pemungut bendahara sekolah.",
          actionText: "Cabut Status Pemungut",
        };
      case "penunjukan-pmse":
        return {
          title: "Penunjukan Pemungut PPN PMSE",
          desc: "Pengelolaan penunjukan pemungutan PPN perdagangan sistem elektronik / platform edukasi.",
          actionText: "Daftar Pemungut PMSE",
        };
      case "nonaktif":
      default:
        return {
          title: "Penetapan Wajib Pajak Nonaktif",
          desc: "Pengajuan status nonaktif (Non-Efektif) bagi satuan pendidikan yang tidak lagi memenuhi kriteria subjektif/objektif.",
          actionText: "Ajukan Penetapan Nonaktif",
        };
    }
  };

  const info = getStatusInfo();
  const [remarks, setRemarks] = useState("");
  const { addServiceRequest } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addServiceRequest({
      type: "PERUBAHAN_STATUS",
      title: info.title,
      category: "Perubahan Status Wajib Pajak",
      applicantName: schoolProfile.principalName || "DR. H. SURYADI, M.PD",
      npwp: schoolProfile.taxId || "9988770000010609",
      status: "DALAM_PROSES",
      progressPercent: 30,
      currentStep: "Penelitian Formal oleh Seksi Pelayanan KPP",
      notes: remarks || "Permohonan penyesuaian status perpajakan instansi sekolah",
    });
    showToast({
      type: "success",
      title: "Permohonan Status Berhasil Diajukan",
      description: `Permohonan "${info.title}" telah diterima sistem Coretax untuk diverifikasi oleh Account Representative (AR).`
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/dashboard" },
        { label: "Perubahan Status", href: "/dashboard" },
        { label: info.title }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{info.title}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{info.desc}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Wajib Pajak
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
                  value={schoolProfile.taxId || schoolProfile.npwp16 || "9988770000010609"}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alasan Permohonan & Dasar Pertimbangan
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tuliskan keterangan lengkap serta lampiran surat keputusan / dasar pengajuan..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 outline-none font-medium text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{info.actionText}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
