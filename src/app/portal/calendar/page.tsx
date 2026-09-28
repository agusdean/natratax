"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CalendarClock, AlertTriangle, CheckCircle2, Clock, Calendar } from "lucide-react";

export default function CalendarPage() {
  const taxSchedule = [
    {
      id: "sch-1",
      deadline: "10 Oktober 2026",
      type: "Penyetoran PPh Unifikasi & PPh 21",
      category: "SETORAN KAS NEGARA",
      description: "Penyetoran PPh Pasal 21 (Honor Guru/Asesor), PPh 22, 23, dan PPh Final 4(2) masa September 2026.",
      status: "SEGERA (12 HARI LAGI)",
      isUrgent: true,
      amount: "Rp 1.549.000",
    },
    {
      id: "sch-2",
      deadline: "15 Oktober 2026",
      type: "Penyetoran PPN WAPU Instansi",
      category: "SETORAN KAS NEGARA",
      description: "Penyetoran PPN oleh Bendahara Pengeluaran BOS atas pengadaan barang kena pajak yang dipungut.",
      status: "TERJADWAL",
      isUrgent: false,
      amount: "Rp 8.250.000",
    },
    {
      id: "sch-3",
      deadline: "20 Oktober 2026",
      type: "Pelaporan SPT Masa Unifikasi & PPh 21",
      category: "PELAPORAN SPT MASA",
      description: "Batas akhir pelaporan SPT Masa Unifikasi dan SPT Masa PPh 21/26 masa pajak September.",
      status: "TERJADWAL",
      isUrgent: false,
      amount: "2 Formulir SPT",
    },
    {
      id: "sch-4",
      deadline: "31 Oktober 2026",
      type: "Pelaporan SPT Masa PPN 1107 PUT",
      category: "PELAPORAN SPT MASA",
      description: "Pelaporan formulir induk dan lampiran PPN Pemungut Bendahara BOS bulan September.",
      status: "TERJADWAL",
      isUrgent: false,
      amount: "1 Formulir PPN",
    },
    {
      id: "sch-5",
      deadline: "30 April 2027",
      type: "Pelaporan SPT Tahunan Badan Yayasan",
      category: "SPT TAHUNAN YAYASAN",
      description: "SPT Tahunan Badan Formulir 1771 Yayasan Pendidikan Bina Putra beserta laporan keuangan teraudit.",
      status: "TAHUN BUKU BERJALAN",
      isUrgent: false,
      amount: "Tahun Pajak 2026",
    }
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/dashboard" },
        { label: "Kalender Pajak Sekolah" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Kalender & Batas Waktu Pajak Sekolah
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Jadwal resmi penyetoran kas negara dan pelaporan SPT instansi pendidikan tahun 2026
              </p>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-3.5">
          {taxSchedule.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-xs transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.isUrgent
                  ? "border-amber-300 dark:border-amber-800/80 bg-amber-50/20"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold ${
                  item.isUrgent
                    ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"
                    : "bg-indigo-50 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200"
                }`}>
                  <Calendar className="w-5 h-5 mb-0.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      item.isUrgent
                        ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white mt-1">
                    {item.type}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="text-left md:text-right shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-400">Jatuh Tempo:</p>
                <p className="text-sm font-black text-slate-900 dark:text-white font-mono">
                  {item.deadline}
                </p>
                <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {item.amount}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AppShell>
  );
}
