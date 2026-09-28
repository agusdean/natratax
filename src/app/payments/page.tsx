"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  X, 
  FileText, 
  ShieldCheck, 
  Building2,
  Copy,
  Receipt
} from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";

function PaymentsPageContent() {
  const searchParams = useSearchParams();
  const { payments, recordPayment, addPayment, showToast, isCompactMode } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedPayForAction, setSelectedPayForAction] = useState<any>(null);
  const [ntpnInput, setNtpnInput] = useState("9832" + Math.floor(100000000000 + Math.random() * 900000000000));
  const [channelInput, setChannelInput] = useState("Bank DKI Virtual Account (Kas BOS)");

  // Create billing form state
  const [isCreateBillingOpen, setIsCreateBillingOpen] = useState(false);
  const [billingTaxType, setBillingTaxType] = useState("PPh Unifikasi (Pasal 22, 23, 4(2))");
  const [billingPeriod, setBillingPeriod] = useState("September 2026");
  const [billingAmount, setBillingAmount] = useState<number>(1500000);
  const [billingDueDate, setBillingDueDate] = useState("2026-10-10");
  const [billingNote, setBillingNote] = useState("Penyetoran Pajak Instansi Sekolah BOS");

  // Sync with URL query parameter
  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam) {
      setActiveFilter(statusParam.toUpperCase());
    } else {
      setActiveFilter("ALL");
    }
  }, [searchParams]);

  const filteredPayments = payments.filter((p) => {
    if (activeFilter === "ALL") return true;
    return p.status === activeFilter;
  });

  const handlePayConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayForAction) return;

    recordPayment(selectedPayForAction.id, ntpnInput, channelInput);
    setSelectedPayForAction(null);
  };

  const handleCreateBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const billingCode = "0239 " + Math.floor(1000 + Math.random() * 9000) + " " + Math.floor(1000 + Math.random() * 9000);

    addPayment({
      billingCode,
      taxType: billingTaxType,
      period: billingPeriod,
      amount: Number(billingAmount),
      dueDate: billingDueDate,
      status: "PENDING",
      referenceNote: billingNote,
    });

    setIsCreateBillingOpen(false);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    showToast({
      type: "success",
      title: "Tersalin",
      description: `${label} (${text}) berhasil disalin.`,
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Pembayaran", href: "/payments" },
        { label: "Tagihan & NTPN" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Penyetoran Pajak & Kode Billing
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Penerbitan Kode Billing e-Billing & Validasi Bukti Penerimaan Negara (NTPN)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateBillingOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Kode Billing</span>
            </button>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Kas Bank Pengeluaran BOS: <strong>Bank DKI</strong>
            </span>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "ALL", label: "Semua Tagihan" },
            { id: "PENDING", label: "Menunggu Penyetoran" },
            { id: "PAID", label: "Lunas (Ada NTPN)" },
            { id: "LATE", label: "Jatuh Tempo Pajak" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveFilter(st.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === st.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Payments Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isCompactMode ? "compact-table" : ""}`}>
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Kode Billing (e-Billing)</th>
                  <th className="py-3 px-4">Jenis Pajak</th>
                  <th className="py-3 px-4">Masa Pajak</th>
                  <th className="py-3 px-4 text-right">Jumlah Setoran</th>
                  <th className="py-3 px-4">Jatuh Tempo</th>
                  <th className="py-3 px-4">NTPN / Bukti Setor</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi Pelunasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-black text-indigo-700 dark:text-indigo-400">
                        {p.billingCode}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {p.taxType}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {p.period}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-slate-900 dark:text-white">
                        {formatRupiah(p.amount)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {formatDateIndo(p.dueDate)}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {p.ntpn ? (
                          <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {p.ntpn}
                            <div className="text-[9px] text-slate-400 font-sans">{p.paymentChannel}</div>
                          </div>
                        ) : (
                          <span className="text-amber-600 font-semibold italic">Belum dibayar</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {p.status === "PENDING" ? (
                          <button
                            onClick={() => {
                              setSelectedPayForAction(p);
                              setNtpnInput("9832" + Math.floor(100000000000 + Math.random() * 900000000000));
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-2xs"
                          >
                            Input NTPN
                          </button>
                        ) : (
                          <button
                            onClick={() => showToast({ type: "info", title: "Bukti Bayar", description: `BPE / Bukti Setor Negara NTPN ${p.ntpn} telah terekam.` })}
                            className="px-2 py-1 text-slate-400 hover:text-slate-600 text-[10px]"
                          >
                            Cetak BPN
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 border border-emerald-100 dark:border-emerald-900">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          Semua Tagihan Tertib & Nihil
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          Tidak ada kode billing atau setoran pajak yang tertunda pembayarannya saat ini.
                        </p>
                        <button
                          onClick={() => setIsCreateBillingOpen(true)}
                          className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#381750] text-white text-xs font-bold hover:bg-[#4d1f6e] transition-colors shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Generate e-Billing Baru</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Input NTPN Dialog */}
      {selectedPayForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Validasi Penyetoran Pajak (NTPN)
              </h3>
              <button onClick={() => setSelectedPayForAction(null)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePayConfirm} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Kode Billing:</span>
                  <span className="font-mono font-bold text-indigo-600">{selectedPayForAction.billingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Pembayaran:</span>
                  <span className="font-mono font-bold">{formatRupiah(selectedPayForAction.amount)}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Transaksi Penerimaan Negara (NTPN 16 Karakter)
                </label>
                <input
                  type="text"
                  required
                  value={ntpnInput}
                  onChange={(e) => setNtpnInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kanal Pembayaran / Rekening Kas Sekolah
                </label>
                <select
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-semibold"
                >
                  <option value="Bank DKI Virtual Account (Kas BOS)">Bank DKI Virtual Account (Kas BOS SMK)</option>
                  <option value="Bank Mandiri Korporasi">Bank Mandiri Korporasi Yayasan</option>
                  <option value="ATM / Teller Bank Persepsi">ATM / Teller Bank Persepsi</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayForAction(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-bold"
                >
                  Konfirmasi Lunas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Billing Code Modal */}
      {isCreateBillingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Penerbitan Kode Billing e-Billing</h3>
              </div>
              <button onClick={() => setIsCreateBillingOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBillingSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jenis Pajak / Akun Setoran</label>
                <select
                  value={billingTaxType}
                  onChange={(e) => setBillingTaxType(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-semibold"
                >
                  <option value="PPh Unifikasi (Pasal 22, 23, 4(2))">PPh Unifikasi (Pasal 22, 23, 4(2)) - Akun 411128</option>
                  <option value="PPh Pasal 21 Masa">PPh Pasal 21 Masa (Guru/Asesor) - Akun 411121</option>
                  <option value="PPN Wapu Bendahara Sekolah">PPN Wapu Bendahara Sekolah - Akun 411211</option>
                  <option value="PPh Final Pasal 4(2) Sewa">PPh Final Pasal 4(2) Sewa Gedung - Akun 411128</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Masa / Bulan Pajak</label>
                  <input
                    type="text"
                    required
                    value={billingPeriod}
                    onChange={(e) => setBillingPeriod(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-medium"
                    placeholder="Contoh: September 2026"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Batas Waktu Setor (Jatuh Tempo)</label>
                  <input
                    type="date"
                    required
                    value={billingDueDate}
                    onChange={(e) => setBillingDueDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah Setoran Pajak (Rp)</label>
                <input
                  type="number"
                  required
                  value={billingAmount}
                  onChange={(e) => setBillingAmount(Number(e.target.value))}
                  className="w-full p-2 font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Catatan Referensi Transaksi</label>
                <input
                  type="text"
                  required
                  value={billingNote}
                  onChange={(e) => setBillingNote(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Estimasi Kode Billing:</span>
                  <span className="font-bold text-blue-600">0239 XXXX XXXX (Otomatis)</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-blue-200 dark:border-blue-800">
                  <span>Nominal Setoran:</span>
                  <span>{formatRupiah(billingAmount)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateBillingOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all"
                >
                  Terbitkan Billing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function PaymentsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-400">Memuat data pembayaran...</div>}>
      <PaymentsPageContent />
    </React.Suspense>
  );
}
