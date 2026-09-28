"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { ShieldCheck, Key, CheckCircle2, Copy, Download, RefreshCw } from "lucide-react";

export default function SertifikatElektronikPage() {
  const { currentUser, schoolProfile, showToast } = useApp();
  const [passphrase, setPassphrase] = useState("BINAPUTRA2026TAX");
  const [isCopied, setIsCopied] = useState(false);

  const certData = {
    serialNumber: "72:81:90:AF:BC:11:45:90",
    subject: "CN=DUWI HERU SANTOSO, O=SMK BINA PUTRA JAKARTA, C=ID",
    issuer: "Otoritas Sertifikat Pajak Direktorat Jenderal Pajak (CA DJP)",
    validFrom: "2026-01-01",
    validTo: "2028-01-01",
    status: "AKTIF & TERVERIFIKASI",
    fingerprintSha256: "E3:B0:C4:42:98:FC:1C:14:9A:FB:F4:C8:99:6F:B9:24:27:AE:41:E4:64:9B:93:4C:A4:95:99:1B:78:52:B8:55",
  };

  const handleCopyPassphrase = () => {
    navigator.clipboard?.writeText(passphrase);
    setIsCopied(true);
    showToast({
      type: "success",
      title: "Passphrase Tersalin",
      description: "Kode otorisasi passphrase sertifikat berhasil disalin."
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/dashboard" },
        { label: "Sertifikat Elektronik" }
      ]}
    >
      <div className="space-y-5">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Kode Otorisasi & Sertifikat Elektronik
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kredensial Tanda Tangan Digital Resmi Coretax untuk e-Faktur dan Bukti Potong Pajak
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 w-fit">
            {certData.status}
          </span>
        </div>

        {/* Certificate Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Informasi Kredensial Digital Satuan Pendidikan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400">Pemilik Sertifikat (Subject):</p>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{certData.subject}</p>
              </div>
              <div>
                <p className="text-slate-400">Penerbit Resmi (Issuer):</p>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">{certData.issuer}</p>
              </div>
              <div>
                <p className="text-slate-400">Nomor Seri Digital:</p>
                <p className="font-mono font-bold text-indigo-700 dark:text-indigo-400 mt-0.5">{certData.serialNumber}</p>
              </div>
              <div>
                <p className="text-slate-400">Masa Berlaku:</p>
                <p className="font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{certData.validFrom} s.d {certData.validTo}</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-slate-400 text-xs">Fingerprint SHA-256:</p>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] break-all text-slate-600 dark:text-slate-400 mt-1">
                {certData.fingerprintSha256}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => showToast({ type: "success", title: "Unduh Sertifikat", description: "Mengunduh file sertifikat digital .p12..." })}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File .p12</span>
              </button>
              <button
                onClick={() => showToast({ type: "info", title: "Perbarui Sertifikat", description: "Permohonan perpanjangan sertifikat dikirim ke KPP." })}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Perbarui Masa Berlaku</span>
              </button>
            </div>
          </div>

          {/* Passphrase Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Passphrase Penandatanganan
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kode otorisasi passphrase digunakan saat validasi faktur keluaran dan pelaporan SPT unifikasi sekolah.
              </p>

              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl">
                <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold block mb-1">
                  Kode Aktif:
                </span>
                <div className="flex items-center justify-between font-mono text-sm font-black text-amber-900 dark:text-amber-200">
                  <span>{passphrase}</span>
                  <button
                    onClick={handleCopyPassphrase}
                    className="p-1 rounded hover:bg-amber-100 text-amber-700"
                    title="Salin Passphrase"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              Jaga kerahasiaan passphrase ini. Hanya Bendahara dan Kepala Sekolah yang memiliki wewenang penandatanganan elektronik.
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
