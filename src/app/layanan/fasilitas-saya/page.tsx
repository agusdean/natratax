"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function DaftarFasilitasSayaPage() {
  const facilities = [
    {
      name: "Pembebasan PPh atas Sisa Lebih Yayasan Pendidikan",
      basis: "Pasal 4 Ayat (3) Huruf m UU PPh jo. PMK-68/PMK.03/2020",
      status: "AKTIF",
      expiry: "31 Desember 2027",
      desc: "Sisa lebih yang diperoleh satuan pendidikan kejuruan dikecualikan dari objek PPh sepanjang ditanamkan kembali dalam bentuk sarana dan prasarana dalam jangka waktu paling lama 4 tahun."
    },
    {
      name: "Fasilitas Pengurangan Penghasilan Bruto (Super Tax Deduction Vokasi)",
      basis: "PP No. 45 Tahun 2019 jo. PMK-128/PMK.010/2019",
      status: "TERDAFTAR KEMITRAAN DU/DI",
      expiry: "Permanen",
      desc: "Kemitraan praktik kerja lapangan (PKL) dan teaching factory SMK Bina Putra berhak memberikan insentif pajak hingga 200% bagi industri mitra."
    },
    {
      name: "Pembebasan PBB Sektor Perkotaan Lahan Pendidikan",
      basis: "UU PDRD & Perda DKI Jakarta",
      status: "BEBAS 100%",
      expiry: "Tahunan Otomatis",
      desc: "Lahan dan gedung sekolah yang semata-mata digunakan untuk kepentingan umum pendidikan tidak dikenakan PBB-P2."
    }
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Daftar Fasilitas Saya" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Daftar Fasilitas Perpajakan Saya</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Insentif pajak, pembebasan PPh yayasan, dan super tax deduction vokasi sekolah</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {facilities.map((f, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{f.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 w-fit">
                  {f.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{f.desc}</p>
              <div className="flex flex-wrap justify-between text-[11px] text-slate-400 pt-1">
                <span>Dasar Hukum: {f.basis}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Berlaku: {f.expiry}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
