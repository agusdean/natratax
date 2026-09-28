"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Building2, Plus, Search, Eye, Phone, MapPin, X, ShieldCheck, CheckCircle2 } from "lucide-react";
import { formatNPWP } from "@/lib/utils";
import { Vendor } from "@/types";

export default function VendorsPage() {
  const { vendors, addVendor, showToast, isCompactMode } = useApp();
  const [search, setSearch] = useState("");
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // New vendor form state
  const [name, setName] = useState("");
  const [type, setType] = useState("Perusahaan (PKP)");
  const [npwp, setNpwp] = useState("");
  const [category, setCategory] = useState("Pengadaan Sarana & Prasarana BOS");
  const [bankAccount, setBankAccount] = useState("Bank DKI - 102.21.00000");
  const [city, setCity] = useState("Jakarta Timur");
  const [phone, setPhone] = useState("021-88990000");
  const [address, setAddress] = useState("Jl. Matraman Raya, Jakarta Timur");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !npwp) return;

    addVendor({
      name,
      type,
      npwp,
      category,
      bankAccount,
      city,
      status: "TERVERIFIKASI SIPLAH",
      phone,
      address,
    });

    setName("");
    setNpwp("");
    setIsAddVendorOpen(false);
  };

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase()) ||
      v.npwp.includes(search)
  );

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Manajemen", href: "/management/users" },
        { label: "Master Vendor BOS" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Master Rekanan, Penyedia BOS & Tenaga Ahli
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pangkalan data penyedia barang/jasa dan instruktur kejuruan SMK BINA PUTRA JAKARTA
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddVendorOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rekanan</span>
          </button>
        </div>

        {/* Vendors Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari rekanan, kategori, NPWP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs outline-none"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {filtered.length} Rekanan Terdaftar
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isCompactMode ? "compact-table" : ""}`}>
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Nama Rekanan / Penyedia</th>
                  <th className="py-3 px-4">Tipe Badan</th>
                  <th className="py-3 px-4">NPWP / NIK</th>
                  <th className="py-3 px-4">Kategori Bidang Usaha</th>
                  <th className="py-3 px-4">Rekening Penampung</th>
                  <th className="py-3 px-4 text-center">Status Validasi</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {filtered.length > 0 ? (
                  filtered.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {v.name}
                        <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {v.city}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {v.type}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600 dark:text-slate-400">
                        {formatNPWP(v.npwp)}
                      </td>
                      <td className="py-3 px-4 font-medium text-indigo-700 dark:text-indigo-300">
                        {v.category}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {v.bankAccount}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedVendor(v)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                          title="Lihat Profil Rekanan"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 border border-indigo-100 dark:border-indigo-900">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          Belum Ada Rekanan Terdaftar
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          Daftar rekanan, penyedia SIPLah, pengadaan sarpras BOS, atau instruktur belum diinput.
                        </p>
                        <button
                          onClick={() => setIsAddVendorOpen(true)}
                          className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#381750] text-white text-xs font-bold hover:bg-[#4d1f6e] transition-colors shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Daftarkan Rekanan Baru</span>
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

      {/* Add Vendor Modal */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-950/20">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pendaftaran Rekanan / Vendor Baru</h3>
              </div>
              <button onClick={() => setIsAddVendorOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Perusahaan / Penyedia / Instruktur</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Bina Karya Solusi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bentuk Badan Usaha</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-semibold"
                  >
                    <option value="Perusahaan (PKP)">Perusahaan (PKP)</option>
                    <option value="Badan Usaha / Toko (Non-PKP)">Badan Usaha / Toko (Non-PKP)</option>
                    <option value="Yayasan Pendidikan">Yayasan Pendidikan</option>
                    <option value="Orang Pribadi (Non-Pegawai)">Orang Pribadi (Non-Pegawai / Asesor)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">NPWP / NIK (15/16 Digit)</label>
                  <input
                    type="text"
                    required
                    placeholder="01.234.567.8-012.000"
                    value={npwp}
                    onChange={(e) => setNpwp(e.target.value)}
                    className="w-full p-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori Pengadaan</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Rekening Bank Rekanan</label>
                  <input
                    type="text"
                    placeholder="Bank DKI - 102.21.XXXX"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full p-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kota Domisili</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddVendorOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-all"
                >
                  Simpan Rekanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-950/20">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Profil Lengkap Rekanan Sekolah</h3>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Rekanan:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedVendor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NPWP / NIK:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{formatNPWP(selectedVendor.npwp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bentuk Usaha:</span>
                  <span className="font-semibold">{selectedVendor.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bidang Pengadaan:</span>
                  <span className="font-semibold text-purple-700 dark:text-purple-300">{selectedVendor.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rekening Kas:</span>
                  <span className="font-mono font-medium">{selectedVendor.bankAccount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kota / Alamat:</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedVendor.address || selectedVendor.city}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-[11px]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Rekanan ini terverifikasi dalam sistem pengadaan BOS SMK Bina Putra Jakarta.</span>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
