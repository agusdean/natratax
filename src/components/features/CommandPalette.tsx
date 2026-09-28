"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  Search, 
  X, 
  FileText, 
  Files, 
  ArrowRight, 
  CreditCard, 
  Building2, 
  BookOpen, 
  Scale 
} from "lucide-react";

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    transactions, 
    invoices, 
    sptList, 
    bupotList 
  } = useApp();

  const [query, setQuery] = useState("");

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const ALL_SERVICES = [
    { title: "Pajak Keluaran", category: "e-Faktur", url: "/invoices/outgoing" },
    { title: "Pajak Masukan", category: "e-Faktur", url: "/invoices/incoming" },
    { title: "Retur Pajak Keluaran", category: "e-Faktur", url: "/invoices/retur-keluaran" },
    { title: "Retur Pajak Masukan", category: "e-Faktur", url: "/invoices/retur-masukan" },
    { title: "Dokumen Lain Pajak Keluaran", category: "e-Faktur", url: "/invoices/dokumen-lain-keluaran" },
    { title: "Dokumen Lain Pajak Masukan", category: "e-Faktur", url: "/invoices/dokumen-lain-masukan" },
    { title: "Surat Pemberitahuan (SPT)", category: "SPT", url: "/spt" },
    { title: "Coretax Form", category: "SPT", url: "/spt/coretax-form" },
    { title: "Pencatatan Peredaran Bruto", category: "SPT", url: "/spt/pencatatan" },
    { title: "Dasbor Kompensasi", category: "SPT", url: "/spt/kompensasi" },
    { title: "Pengungkapan Ketidakbenaran SPT", category: "SPT", url: "/spt/pengungkapan" },
    { title: "Permohonan Pemindahbukuan (Pbk)", category: "Pembayaran", url: "/payments/pemindahbukuan" },
    { title: "Layanan Mandiri Kode Billing", category: "Pembayaran", url: "/payments/kode-billing" },
    { title: "Kode Billing Atas Tagihan Pajak", category: "Pembayaran", url: "/payments/billing-tagihan" },
    { title: "Daftar Kode Billing Belum Dibayar", category: "Pembayaran", url: "/payments/billing-unpaid" },
    { title: "Formulir Restitusi Pajak", category: "Pembayaran", url: "/payments/restitusi" },
    { title: "Permohonan Pemberian Imbalan Bunga", category: "Pembayaran", url: "/payments/imbalan-bunga" },
    { title: "Permohonan PPh DTP", category: "Pembayaran", url: "/payments/pph-dtp" },
    { title: "Dokumen Saya", category: "Portal Saya", url: "/portal/documents" },
    { title: "Notifikasi Saya", category: "Portal Saya", url: "/portal/notifications" },
    { title: "Kasus Berjalan Saya", category: "Portal Saya", url: "/portal/active-cases" },
    { title: "Profil Saya", category: "Portal Saya", url: "/portal/profile" },
    { title: "Kode Otorisasi / Sertifikat Elektronik", category: "Portal Saya", url: "/portal/sertifikat-elektronik" },
    { title: "Pengukuhan PKP", category: "Portal Saya", url: "/portal/pengukuhan-pkp" },
    { title: "Pendaftaran Objek Pajak PBB P5L", category: "Portal Saya", url: "/portal/pbb-p5l" },
    { title: "Penghapusan & Pencabutan", category: "Portal Saya", url: "/portal/penghapusan-pencabutan" },
    { title: "Riwayat Edukasi", category: "Layanan WP", url: "/layanan/riwayat-edukasi" },
    { title: "Buat Permohonan Layanan Administrasi", category: "Layanan WP", url: "/layanan/buat-permohonan" },
    { title: "Permohonan Dalam Proses", category: "Layanan WP", url: "/layanan/dalam-proses" },
    { title: "Permohonan Telah Selesai", category: "Layanan WP", url: "/layanan/telah-selesai" },
    { title: "Daftar Fasilitas Saya", category: "Layanan WP", url: "/layanan/fasilitas-saya" },
    { title: "Permintaan Informasi Perpajakan", category: "Layanan WP", url: "/layanan/permintaan-informasi" },
    { title: "Buat Pengaduan, Saran, Dan Apresiasi", category: "Layanan WP", url: "/layanan/buat-pengaduan" },
    { title: "Jadwal Kegiatan Edukasi", category: "Layanan WP", url: "/layanan/jadwal-edukasi" },
    { title: "Materi E-Learning", category: "Layanan WP", url: "/layanan/e-learning" },
    { title: "Bukti Potong Saya", category: "e-Bupot", url: "/bupot" },
    { title: "BP 21 - Guru & Asesor", category: "e-Bupot", url: "/bupot?type=BP21" },
    { title: "BPPU - PPh 22 & 23", category: "e-Bupot", url: "/bupot?type=BPPU" },
    { title: "Penyetoran Sendiri", category: "e-Bupot", url: "/bupot?type=Penyetoran" },
    { title: "Buku Kas Umum BOS", category: "Buku Besar", url: "/ledger#bos" },
    { title: "Pengguna & Hak Akses", category: "Manajemen", url: "/management/users" },
    { title: "Aturan & Tarif Pajak", category: "Manajemen", url: "/management/tax-rules" },
    { title: "Master Vendor BOS", category: "Manajemen", url: "/management/vendors" },
    { title: "Audit Trail Forensik", category: "Manajemen", url: "/management/audit-logs" },
  ];

  const filteredServices = ALL_SERVICES.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTransactions = transactions.filter(
    (t) =>
      t.trxNumber.toLowerCase().includes(query.toLowerCase()) ||
      t.vendorName.toLowerCase().includes(query.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
      inv.taxInvoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
      inv.counterpartyName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSpt = sptList.filter(
    (s) =>
      s.taxType.toLowerCase().includes(query.toLowerCase()) ||
      s.taxPeriod.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (url: string) => {
    setIsCommandPaletteOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Cari transaksi BOS, nomor faktur, rekanan, bukti potong..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          
          {/* Quick Shortcuts */}
          {!query && (
            <div>
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Navigasi Cepat
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={() => handleSelect("/dashboard")}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    <span>Portal Saya</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSelect("/invoices")}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    <span>e-Faktur Dashboard</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSelect("/spt")}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <Files className="w-4 h-4 text-amber-500" />
                    <span>Konsep SPT</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => handleSelect("/management/tax-rules")}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emerald-500" />
                    <span>Aturan & Tarif Pajak</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {/* PrakTax Services / Layanan Matches */}
          {query && filteredServices.length > 0 && (
            <div>
              <p className="px-3 text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5">
                Layanan & Fitur PrakTax ({filteredServices.length})
              </p>
              <div className="space-y-1">
                {filteredServices.slice(0, 8).map((srv, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelect(srv.url)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer transition-colors border border-transparent hover:border-amber-200 dark:hover:border-amber-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
                        {srv.category.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-800 dark:text-slate-100">
                          {srv.title}
                        </div>
                        <div className="text-[11px] text-slate-400">{srv.category}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty search feedback */}
          {query && filteredServices.length === 0 && filteredTransactions.length === 0 && filteredInvoices.length === 0 && filteredSpt.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              Tidak ada hasil layanan atau data ditemukan untuk &ldquo;{query}&rdquo;
            </div>
          )}

          {filteredTransactions.length > 0 && (
            <div>
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Transaksi Keuangan ({filteredTransactions.length})
              </p>
              <div className="space-y-1">
                {filteredTransactions.slice(0, 4).map((trx) => (
                  <div
                    key={trx.id}
                    onClick={() => handleSelect("/invoices")}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {trx.trxNumber} — <span className="font-semibold text-slate-600 dark:text-slate-300">{trx.vendorName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{trx.categoryName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        Rp {trx.grossAmount.toLocaleString("id-ID")}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {trx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices Matches */}
          {filteredInvoices.length > 0 && (
            <div>
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                e-Faktur Pajak ({filteredInvoices.length})
              </p>
              <div className="space-y-1">
                {filteredInvoices.slice(0, 3).map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => handleSelect("/invoices")}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {inv.taxInvoiceNumber}
                      </div>
                      <div className="text-[11px] text-slate-400">{inv.counterpartyName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        PPN: Rp {inv.ppnAmount.toLocaleString("id-ID")}
                      </div>
                      <span className="text-[10px] text-slate-400">{inv.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SPT Matches */}
          {filteredSpt.length > 0 && (
            <div>
              <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Surat Pemberitahuan (SPT)
              </p>
              <div className="space-y-1">
                {filteredSpt.map((spt) => (
                  <div
                    key={spt.id}
                    onClick={() => handleSelect("/spt")}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                        {spt.taxType}
                      </div>
                      <div className="text-[11px] text-slate-400">{spt.taxPeriod}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-amber-600">
                        Rp {spt.totalTax.toLocaleString("id-ID")}
                      </div>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        {spt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tekan <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 font-mono text-[10px]">ESC</kbd> untuk menutup</span>
          <span>NatraTax Search Engine v1.0</span>
        </div>

      </div>
    </div>
  );
};
