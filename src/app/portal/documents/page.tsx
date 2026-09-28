"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { 
  FolderOpen, 
  FileText, 
  Download, 
  Search, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  FileCheck2,
  Clock
} from "lucide-react";
import { formatDateIndo } from "@/lib/utils";

export default function DokumenSayaPage() {
  const { schoolProfile, showToast, isCompactMode } = useApp();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const documents = [
    {
      id: "doc-1",
      number: "BPE-20260920-001289",
      title: "Bukti Penerimaan Elektronik (BPE) SPT Masa PPN Agustus 2026",
      category: "BPE",
      date: "2026-09-20",
      status: "TERVERIFIKASI RESMI",
      size: "245 KB",
    },
    {
      id: "doc-2",
      number: "SKF-2026-SMK-00412",
      title: "Surat Keterangan Fiskal (SKF) Sekolah Syarat Akreditasi",
      category: "SKF",
      date: "2026-08-15",
      status: "AKTIF BERLAKU",
      size: "512 KB",
    },
    {
      id: "doc-3",
      number: "CERT-2026-BP-0091",
      title: "Sertifikat Elektronik Otorisasi Coretax Satuan Pendidikan",
      category: "SERTIFIKAT",
      date: "2026-01-10",
      status: "BERLAKU S.D 2028",
      size: "1.2 MB",
    },
    {
      id: "doc-4",
      number: "NTPN-881290318921",
      title: "Bukti Setor NTPN Pajak Belanja Modal BOS Tahap 2",
      category: "NTPN",
      date: "2026-09-12",
      status: "TERCATAT KAS BOS",
      size: "180 KB",
    },
    {
      id: "doc-5",
      number: "BPE-20260810-000843",
      title: "Bukti Penerimaan Elektronik (BPE) SPT Masa Unifikasi Juli 2026",
      category: "BPE",
      date: "2026-08-10",
      status: "TERVERIFIKASI RESMI",
      size: "310 KB",
    },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter = filterType === "ALL" || doc.category === filterType;
    const matchesSearch = 
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.number.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/dashboard" },
        { label: "Dokumen Saya" }
      ]}
    >
      <div className="space-y-5">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#381750] text-white flex items-center justify-center shadow-md">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Dokumen Perpajakan Saya
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Arsip Bukti Penerimaan Elektronik (BPE), SKF, dan Sertifikat Pajak {schoolProfile.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              {filteredDocs.length} Dokumen Tersimpan
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {["ALL", "BPE", "SKF", "SERTIFIKAT", "NTPN"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === cat
                    ? "bg-[#381750] text-white shadow-2xs"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                {cat === "ALL" ? "Semua Berkas" : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nomor dokumen, judul..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 outline-none"
            />
          </div>
        </div>

        {/* Table List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isCompactMode ? "compact-table" : ""}`}>
              <thead className="bg-[#f59e0b] text-slate-950 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Nomor Dokumen</th>
                  <th className="py-2.5 px-4">Nama Dokumen</th>
                  <th className="py-2.5 px-4">Kategori</th>
                  <th className="py-2.5 px-4">Tanggal Terbit</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700 dark:text-indigo-400">
                      {doc.number}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-100">
                      {doc.title}
                    </td>
                    <td className="py-3 px-4 font-bold text-[10px] text-slate-500 uppercase">
                      {doc.category}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {formatDateIndo(doc.date)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          showToast({
                            type: "success",
                            title: "Unduhan Dimulai",
                            description: `Mengunduh berkas ${doc.number}.pdf`
                          });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px]"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
