"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { HelpCircle, Plus, Send } from "lucide-react";

export default function PermintaanInformasiPage() {
  const { showToast } = useApp();
  const [queryTopic, setQueryTopic] = useState("Ketentuan Pemotongan PPh Pasal 21 Guru Honorer / GTT");
  const [queryDetail, setQueryDetail] = useState("");

  const history = [
    {
      ticket: "INFO-2026-003",
      topic: "Perlakuan PPN atas Penjualan Produk Teaching Factory oleh Siswa SMK",
      date: "2026-09-05",
      status: "TERJAWAB",
      answer: "Penyerahan BKP hasil teaching factory yang melebihi batas omzet dikenakan PPN 11%, dan wajib diterbitkan Faktur Pajak Keluaran."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: "success",
      title: "Pertanyaan Dikirim",
      description: "Permintaan informasi perpajakan berhasil diteruskan ke Helpdesk DJP KPP Pratama."
    });
    setQueryDetail("");
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan WP", href: "/layanan" },
        { label: "Daftar Permintaan Informasi Perpajakan" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Layanan Permintaan Informasi Perpajakan</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Konsultasi tertulis mengenai peraturan perpajakan, tarif pemotongan, dan tata cara pelaporan</p>
            </div>
          </div>
        </div>

        {/* Submit Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Kirim Permintaan Informasi Baru</h3>
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Topik Informasi</label>
              <input
                type="text"
                required
                value={queryTopic}
                onChange={(e) => setQueryTopic(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rincian Pertanyaan / Kasus Nyata Sekolah</label>
              <textarea
                rows={3}
                required
                placeholder="Jelaskan pertanyaan peraturan perpajakan yang ingin dikonsultasikan..."
                value={queryDetail}
                onChange={(e) => setQueryDetail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium outline-none"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Pertanyaan</span>
              </button>
            </div>
          </form>
        </div>

        {/* History */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Riwayat Konsultasi & Tanggapan AR</h3>
          {history.map((h) => (
            <div key={h.ticket} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-blue-600">{h.ticket}</span>
                <span className="text-slate-400">{h.date}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{h.topic}</h4>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-xs text-slate-700 dark:text-slate-300 border-l-4 border-blue-500 leading-relaxed">
                <span className="font-bold block text-blue-700 dark:text-blue-300 mb-0.5">Tanggapan Resmi DJP:</span>
                {h.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
