"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Clock, Copy, CreditCard, CheckCircle2, Printer, X, FileText, Download } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { PaymentRecord } from "@/types";

export default function BillingUnpaidPage() {
  const { payments, recordPayment, schoolProfile, showToast } = useApp();
  const unpaid = payments.filter((p) => p.status === "PENDING");

  const [selectedPay, setSelectedPay] = useState<PaymentRecord | null>(null);
  const [printPay, setPrintPay] = useState<PaymentRecord | null>(null);
  const [ntpnInput, setNtpnInput] = useState("");
  const [channelInput, setChannelInput] = useState("Bank DKI Virtual Account (Kas BOS)");

  const handleOpenPay = (p: PaymentRecord) => {
    setSelectedPay(p);
    // Suggest a realistic NTPN
    const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const num = Math.floor(10000000 + Math.random() * 90000000);
    setNtpnInput(`${hex}${num}`);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPay) return;
    recordPayment(selectedPay.id, ntpnInput, channelInput);
    setSelectedPay(null);
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Pembayaran", href: "/payments" },
        { label: "Kode Billing Belum Dibayar" }
      ]}
    >
      <div className="space-y-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Daftar Kode Billing Belum Dibayar</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Daftar kode billing aktif yang menunggu eksekusi setor dari Kas BOS</p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300">
            {unpaid.length} Billing Aktif
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f59e0b] text-slate-950 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-4 font-mono">Kode Billing</th>
                  <th className="py-2.5 px-4">Jenis Pajak</th>
                  <th className="py-2.5 px-4">Masa Pajak</th>
                  <th className="py-2.5 px-4 text-right">Nominal Setor (Rp)</th>
                  <th className="py-2.5 px-4">Batas Pembayaran</th>
                  <th className="py-2.5 px-4 text-center">Aksi Pelunasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {unpaid.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                      Tidak ada kode billing tertunggak. Seluruh setoran pajak sekolah telah lunas.
                    </td>
                  </tr>
                ) : (
                  unpaid.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                        {p.billingCode}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                        <div>{p.taxType}</div>
                        <div className="text-[11px] text-slate-400">{p.referenceNote}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{p.period}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {formatRupiah(p.amount)}
                      </td>
                      <td className="py-3 px-4 font-medium text-red-600">{p.dueDate}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenPay(p)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-bold text-white text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Setor / NTPN</span>
                          </button>
                          <button
                            onClick={() => setPrintPay(p)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                            title="Cetak Cetakan Kode Billing"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(p.billingCode);
                              showToast({ type: "success", title: "Tersalin", description: `Kode billing ${p.billingCode} berhasil disalin.` });
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                            title="Salin ID Billing"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Validasi / Input NTPN */}
        {selectedPay && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Validasi Penyetoran Kas BOS</h3>
                </div>
                <button onClick={() => setSelectedPay(null)} className="p-1 hover:bg-slate-100 rounded">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kode Billing:</span>
                  <span className="font-mono font-bold text-amber-600">{selectedPay.billingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jenis Pajak:</span>
                  <span className="font-medium text-right max-w-[220px]">{selectedPay.taxType}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Nominal Setor:</span>
                  <span className="font-mono text-emerald-600">{formatRupiah(selectedPay.amount)}</span>
                </div>
              </div>

              <form onSubmit={handleConfirmPayment} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Transaksi Penerimaan Negara (NTPN 16 Digit)
                  </label>
                  <input
                    type="text"
                    required
                    value={ntpnInput}
                    onChange={(e) => setNtpnInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono font-bold uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kanal / Rekening Penyetoran Kas
                  </label>
                  <select
                    value={channelInput}
                    onChange={(e) => setChannelInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-medium"
                  >
                    <option value="Bank DKI Virtual Account (Kas BOS)">Bank DKI Virtual Account (Kas BOS)</option>
                    <option value="Bank Mandiri BPP Penerimaan Negara">Bank Mandiri BPP Penerimaan Negara</option>
                    <option value="Kantor Pos Giro MPN G3">Kantor Pos Giro MPN G3</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedPay(null)}
                    className="px-4 py-2 rounded-lg border border-slate-200 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                  >
                    Konfirmasi Pajak Lunas
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Cetakan Kode Billing */}
        {printPay && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cetakan Kode Billing DJP</h3>
                </div>
                <button onClick={() => setPrintPay(null)} className="p-1 hover:bg-slate-100 rounded">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="border border-slate-300 dark:border-slate-700 p-4 rounded-xl space-y-2 text-xs font-mono bg-amber-50/20">
                <div className="text-center font-bold text-sm border-b pb-2">
                  KEMENTERIAN KEUANGAN REPUBLIK INDONESIA<br />
                  DIREKTORAT JENDERAL PAJAK<br />
                  <span className="text-xs font-normal">CETAKAN KODE BILLING</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>KODE BILLING:</span>
                  <span className="font-bold text-amber-700 text-sm">{printPay.billingCode}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>NPWP:</span>
                  <span>{schoolProfile.taxId}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>NAMA WP:</span>
                  <span>{schoolProfile.name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>JENIS PAJAK:</span>
                  <span>{printPay.taxType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>MASA/TAHUN:</span>
                  <span>{printPay.period}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-sm border-t pt-1">
                  <span>JUMLAH SETOR:</span>
                  <span>{formatRupiah(printPay.amount)}</span>
                </div>
                <div className="flex justify-between py-1 text-red-600">
                  <span>BATAS BAYAR:</span>
                  <span>{printPay.dueDate} 23:59:59</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => {
                    showToast({ type: "success", title: "Cetak Dokumen", description: `Cetakan Kode Billing ${printPay.billingCode} dikirim ke antrean cetak.` });
                    setPrintPay(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Print PDF</span>
                </button>
                <button
                  onClick={() => setPrintPay(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
