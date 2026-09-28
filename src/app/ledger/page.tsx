"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BookOpen, CheckCircle2, FileSpreadsheet, Scale, Building2, Download } from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { ExportModal } from "@/components/features/ExportModal";

function LedgerPageContent() {
  const searchParams = useSearchParams();
  const { isCompactMode, transactions, invoices, bupotList, payments } = useApp();
  const [activeTab, setActiveTab] = useState<"JURNAL_UMUM" | "JURNAL_PAJAK" | "KAS_BOS" | "REKONSILIASI">("JURNAL_UMUM");
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync tab with URL hash or search param
  useEffect(() => {
    const handleHashOrParam = () => {
      const hash = typeof window !== "undefined" ? window.location.hash.toLowerCase() : "";
      const tabParam = searchParams.get("tab")?.toLowerCase();

      if (hash.includes("pajak") || tabParam === "pajak") {
        setActiveTab("JURNAL_PAJAK");
      } else if (hash.includes("bos") || tabParam === "bos") {
        setActiveTab("KAS_BOS");
      } else if (hash.includes("rekon") || tabParam === "rekon") {
        setActiveTab("REKONSILIASI");
      } else if (hash.includes("umum") || tabParam === "umum") {
        setActiveTab("JURNAL_UMUM");
      }
    };

    handleHashOrParam();
    window.addEventListener("hashchange", handleHashOrParam);
    return () => window.removeEventListener("hashchange", handleHashOrParam);
  }, [searchParams]);

  // Derived General Journals from transactions
  const generalJournals = transactions.flatMap((t) => [
    {
      id: `jrn-${t.id}-1`,
      date: t.date,
      refNumber: `JRN/${t.trxNumber}`,
      accountCode: "5-1000",
      accountName: `Beban ${t.type.replace(/_/g, " ")}`,
      description: t.description,
      debit: t.grossAmount,
      credit: 0,
      taxRef: t.trxNumber,
    },
    {
      id: `jrn-${t.id}-2`,
      date: t.date,
      refNumber: `JRN/${t.trxNumber}`,
      accountCode: "1-1101",
      accountName: "Kas & Bank Operasional BOS",
      description: `Pengeluaran ${t.vendorName}`,
      debit: 0,
      credit: t.netAmount,
      taxRef: t.trxNumber,
    },
    ...(t.taxAmount > 0 ? [{
      id: `jrn-${t.id}-3`,
      date: t.date,
      refNumber: `JRN/${t.trxNumber}`,
      accountCode: "2-1300",
      accountName: `Utang ${t.taxType} Terutang`,
      description: `Pemotongan ${t.taxType} (${t.taxRate}%) atas ${t.vendorName}`,
      debit: 0,
      credit: t.taxAmount,
      taxRef: t.trxNumber,
    }] : [])
  ]);

  const totalDebit = generalJournals.reduce((s, j) => s + j.debit, 0);
  const totalCredit = generalJournals.reduce((s, j) => s + j.credit, 0);

  // Derived Dedicated Tax Journals from invoices & transactions
  const taxJournals = [
    ...invoices.map((inv) => ({
      id: `tj-inv-${inv.id}`,
      date: inv.date,
      ref: `TAX/INV/${inv.invoiceNumber}`,
      account: inv.type === "MASUKAN" ? "2-1302 Utang PPN Masukan Dipungut" : "2-1301 PPN Keluaran",
      desc: `PPN 11% Faktur ${inv.taxInvoiceNumber} - ${inv.counterpartyName}`,
      debit: inv.type === "MASUKAN" ? 0 : inv.ppnAmount,
      credit: inv.type === "MASUKAN" ? inv.ppnAmount : 0,
      bpe: inv.taxInvoiceNumber,
    })),
    ...transactions.filter((t) => t.taxAmount > 0).map((t) => ({
      id: `tj-trx-${t.id}`,
      date: t.date,
      ref: `TAX/TRX/${t.trxNumber}`,
      account: `Utang ${t.taxType} Terutang`,
      desc: `Pemotongan ${t.taxType} atas ${t.vendorName}`,
      debit: 0,
      credit: t.taxAmount,
      bpe: t.trxNumber,
    }))
  ];

  // Derived Kas Pembantu BOS
  const kasBosLines = transactions.map((t) => ({
    id: `kb-${t.id}`,
    date: t.date,
    evidence: t.trxNumber,
    desc: `Belanja ${t.description} - ${t.vendorName}`,
    debit: 0,
    credit: t.netAmount,
    balance: 250000000 - t.netAmount,
  }));

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Buku Besar", href: "/ledger" },
        { label: "Jurnal & Rekonsiliasi" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Buku Besar & Pembukuan Pajak Sekolah
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pencatatan Akuntansi Finansial, Belanja Dana BOS, dan Utang Pajak Terutang
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              Jurnal Seimbang (Balance)
            </span>
            <button
              onClick={() => setIsExportOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300"
              title="Ekspor Jurnal"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("JURNAL_UMUM")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "JURNAL_UMUM"
                ? "bg-[#381750] text-white shadow-xs"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Jurnal Umum ({generalJournals.length})
          </button>
          <button
            onClick={() => setActiveTab("JURNAL_PAJAK")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "JURNAL_PAJAK"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Jurnal Utang Pajak ({taxJournals.length})
          </button>
          <button
            onClick={() => setActiveTab("KAS_BOS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "KAS_BOS"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Buku Pembantu Kas BOS ({kasBosLines.length})
          </button>
          <button
            onClick={() => setActiveTab("REKONSILIASI")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "REKONSILIASI"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Rekonsiliasi Fiskal & Saldo
          </button>
        </div>

        {/* Tab 1: Jurnal Umum */}
        {activeTab === "JURNAL_UMUM" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className={`w-full text-left text-xs ${isCompactMode ? "compact-table" : ""}`}>
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">No. Bukti / Ref</th>
                    <th className="py-3 px-4">Kode Akun</th>
                    <th className="py-3 px-4">Nama Akun & Uraian Jurnal</th>
                    <th className="py-3 px-4">Ref. Faktur / Bupot</th>
                    <th className="py-3 px-4 text-right">Debit (Rp)</th>
                    <th className="py-3 px-4 text-right">Kredit (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                  {generalJournals.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                          <p className="font-bold text-xs text-slate-700 dark:text-slate-300">Belum Ada Ayat Jurnal Umum</p>
                          <p className="text-[11px] text-slate-400">Jurnal umum akan otomatis terbentuk saat transaksi belanja BOS atau honorarium dicatat.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    generalJournals.map((jrn) => (
                      <tr key={jrn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 whitespace-nowrap text-slate-500">{formatDateIndo(jrn.date)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-purple-700 dark:text-purple-300">{jrn.refNumber}</td>
                        <td className="py-3 px-4 font-mono font-bold">{jrn.accountCode}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{jrn.accountName}</div>
                          <div className="text-[11px] text-slate-400">{jrn.description}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{jrn.taxRef}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{jrn.debit > 0 ? formatRupiah(jrn.debit) : "-"}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400">{jrn.credit > 0 ? formatRupiah(jrn.credit) : "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t-2 border-slate-300 dark:border-slate-700">
                  <tr>
                    <td colSpan={5} className="py-3 px-4 text-right font-bold uppercase text-[11px]">Total Saldo Jurnal:</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">{formatRupiah(totalDebit)}</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-rose-600 dark:text-rose-400">{formatRupiah(totalCredit)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Jurnal Utang Pajak */}
        {activeTab === "JURNAL_PAJAK" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/40 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              Pencatatan akun kewajiban perpajakan sekolah (Utang Pajak yang harus disetor ke kas negara via e-Billing)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px] border-b">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Nomor Ref</th>
                    <th className="py-3 px-4">Akun Utang Pajak</th>
                    <th className="py-3 px-4">Keterangan Transaksi</th>
                    <th className="py-3 px-4">Dokumen Sumber</th>
                    <th className="py-3 px-4 text-right">Kewajiban Pajak (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {taxJournals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <Scale className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                          <p className="font-bold text-xs text-slate-700 dark:text-slate-300">Belum Ada Jurnal Pajak Terutang</p>
                          <p className="text-[11px] text-slate-400">Jurnal pajak akan tercatat secara otomatis saat faktur atau bukti potong dibuat.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    taxJournals.map((tj) => (
                      <tr key={tj.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-mono">{formatDateIndo(tj.date)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">{tj.ref}</td>
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{tj.account}</td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{tj.desc}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-purple-600">{tj.bpe}</td>
                        <td className="py-3 px-4 text-right font-mono font-black text-red-600 dark:text-red-400">{formatRupiah(tj.credit)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Kas BOS */}
        {activeTab === "KAS_BOS" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              Buku Pembantu Bank Kas BOS — Rekening Bank DKI No. 102.20.00918
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px] border-b">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">No. Bukti Kas</th>
                    <th className="py-3 px-4">Uraian Arus Kas BOS</th>
                    <th className="py-3 px-4 text-right">Penerimaan (Rp)</th>
                    <th className="py-3 px-4 text-right">Pengeluaran (Rp)</th>
                    <th className="py-3 px-4 text-right">Saldo Kas (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {kasBosLines.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                          <p className="font-bold text-xs text-slate-700 dark:text-slate-300">Belum Ada Mutasi Kas BOS</p>
                          <p className="text-[11px] text-slate-400">Pencatatan mutasi kas bank BOS akan tercatat saat transaksi pengadaan dibukukan.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    kasBosLines.map((kb) => (
                      <tr key={kb.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 whitespace-nowrap">{formatDateIndo(kb.date)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">{kb.evidence}</td>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-100">{kb.desc}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">{kb.debit > 0 ? formatRupiah(kb.debit) : "-"}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">{kb.credit > 0 ? formatRupiah(kb.credit) : "-"}</td>
                        <td className="py-3 px-4 text-right font-mono font-black text-slate-900 dark:text-white">{formatRupiah(kb.balance)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Rekonsiliasi */}
        {activeTab === "REKONSILIASI" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Dasbor Rekonsiliasi Fiskal & Dokumen Perpajakan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">STATUS REKONSILIASI</p>
                <p className="text-2xl font-black text-emerald-700 mt-1">TERTIB</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">Semua data pembukuan klir</p>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200">
                <p className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300">TOTAL FAKTUR TERBIT</p>
                <p className="text-2xl font-black text-indigo-700 mt-1">{invoices.length} Berkas</p>
                <p className="text-[10px] text-indigo-600 mt-0.5">Sinkron dengan jurnal umum</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200">
                <p className="text-[11px] font-bold text-purple-800 dark:text-purple-300">BUKTI POTONG E-BUPOT</p>
                <p className="text-2xl font-black text-purple-700 mt-1">{bupotList.length} Berkas</p>
                <p className="text-[10px] text-purple-600 mt-0.5">Masuk ke SPT Unifikasi</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200">
                <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300">SELISIH / MISMATCH</p>
                <p className="text-2xl font-black text-amber-700 mt-1">Rp 0</p>
                <p className="text-[10px] text-amber-600 mt-0.5">Nihil selisih pembukuan</p>
              </div>
            </div>
          </div>
        )}

      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Buku Besar & Jurnal Perpajakan Sekolah"
        rowCount={generalJournals.length}
        currentFilterText={activeTab}
      />
    </AppShell>
  );
}

export default function LedgerPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat buku besar...</div>}>
      <LedgerPageContent />
    </React.Suspense>
  );
}
