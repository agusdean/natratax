"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { CreditCard, Building2, ShieldCheck, CheckCircle2, Copy, Plus, Star, X } from "lucide-react";
import { formatNPWP } from "@/lib/utils";

export default function AccountsPage() {
  const { currentUser, bankAccounts, addBankAccount, setPrimaryAccount, showToast } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New account form state
  const [bankName, setBankName] = useState("Bank DKI");
  const [branch, setBranch] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("Rekening Operasional Sekolah");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    showToast({
      type: "success",
      title: "Berhasil Disalin",
      description: `${label} (${text}) telah disalin ke papan klip.`,
    });
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountNumber || !accountName) return;

    addBankAccount({
      bankName,
      branch: branch || "KC Pusat Jakarta",
      accountName,
      accountNumber,
      type: accountType,
      status: "AKTIF TERVALIDASI",
      isPrimary: false,
    });

    setIsAddModalOpen(false);
    setBranch("");
    setAccountName("");
    setAccountNumber("");
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/portal/accounts" },
        { label: "Data Rekening & NPWP" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Rekening Kas & Identitas Fiskal Sekolah
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Data rekening resmi penyaluran dana BOS, SPP, dan perpajakan SMK BINA PUTRA JAKARTA
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Rekening</span>
            </button>
          </div>
        </div>

        {/* NPWP Master Card */}
        <div className="bg-gradient-to-r from-[#381750] via-purple-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-purple-950 uppercase tracking-wide">
                WAJIB PAJAK BADAN
              </span>
              <span className="text-xs text-purple-200">KPP Pratama Jakarta Matraman</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight mt-1">
              {currentUser.schoolName}
            </h2>
            <div className="mt-2 flex items-center gap-3">
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-300">
                {formatNPWP(currentUser.taxId)}
              </span>
              <button
                onClick={() => handleCopy(currentUser.taxId, "NPWP Sekolah")}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Salin NPWP"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 text-xs space-y-1.5 min-w-[240px]">
            <div className="flex justify-between">
              <span className="text-purple-200">Status WAPU:</span>
              <span className="font-bold text-amber-300">Pemungut Aktif</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Sertifikat Elektronik:</span>
              <span className="font-bold text-emerald-400">Valid s/d 2027</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Kode Klasifikasi (KLU):</span>
              <span className="font-mono font-bold">85220 (SMK Swasta)</span>
            </div>
          </div>
        </div>

        {/* Bank Accounts Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Rekening Bank Terdaftar ({bankAccounts.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bankAccounts.map((acc) => (
              <div
                key={acc.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-xs flex flex-col justify-between transition-all ${
                  acc.isPrimary ? "border-indigo-500 ring-1 ring-indigo-500" : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-black text-base text-slate-900 dark:text-white">
                        {acc.bankName}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{acc.branch}</p>
                    </div>
                    {acc.isPrimary ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-indigo-600 text-indigo-600" />
                        Rekening Utama
                      </span>
                    ) : (
                      <button
                        onClick={() => setPrimaryAccount(acc.id)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        Set Utama
                      </button>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Nomor Rekening</p>
                      <p className="font-mono font-black text-sm text-slate-800 dark:text-slate-100 mt-0.5">
                        {acc.accountNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(acc.accountNumber, `No. Rekening ${acc.bankName}`)}
                      className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                      title="Salin Nomor Rekening"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-3">
                    {acc.accountName}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{acc.type}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Verifikasi BPKAD / Bank:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {acc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Tambah Rekening */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pendaftaran Rekening Bank Baru</h3>
                    <p className="text-[11px] text-slate-500">Tambahkan rekening resmi satuan pendidikan</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAccount} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Nama Bank
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Bank DKI">Bank DKI</option>
                      <option value="Bank Mandiri">Bank Mandiri</option>
                      <option value="Bank BCA">Bank BCA</option>
                      <option value="Bank BNI">Bank BNI</option>
                      <option value="Bank BRI">Bank BRI</option>
                      <option value="Bank BSI">Bank Syariah Indonesia (BSI)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Kantor Cabang
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: KC Matraman"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 102.20.12345"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Nama Pemilik Rekening (Sesuai Buku Tabungan/Giro)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SMK BINA PUTRA - KAS BOS"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Peruntukan Rekening
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rekening Giro Khusus BOS / Rekening Operasional"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
                  >
                    Daftarkan Rekening
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
