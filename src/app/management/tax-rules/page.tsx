"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { TaxRuleService } from "@/lib/tax-engine";
import { Scale, Edit3, ShieldAlert, Check, Plus, AlertCircle } from "lucide-react";

export default function TaxRulesManagementPage() {
  const { showToast } = useApp();
  const [rules, setRules] = useState(TaxRuleService.getRules());
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<number>(0);

  const handleStartEdit = (rule: any) => {
    setEditingRuleId(rule.id);
    setEditRate(rule.ratePercentage);
  };

  const handleSaveEdit = (id: string) => {
    TaxRuleService.updateRule(id, { ratePercentage: editRate });
    setRules(TaxRuleService.getRules());
    setEditingRuleId(null);
    showToast({
      type: "success",
      title: "Aturan Pajak Diperbarui",
      description: `Tarif pajak berhasil dimutakhirkan menjadi ${editRate}%. Versi aturan baru dicatat dalam audit trail.`,
    });
  };

  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newTaxType, setNewTaxType] = useState<any>("PPN");
  const [newRate, setNewRate] = useState<number>(11);
  const [newDesc, setNewDesc] = useState("");
  const [newEffectiveFrom, setNewEffectiveFrom] = useState("2026-01-01");

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName) return;

    const newRule = {
      id: "rule-" + Date.now(),
      code: newCode,
      name: newName,
      taxType: newTaxType,
      ratePercentage: Number(newRate),
      description: newDesc || "Aturan pajak internal sekolah",
      effectiveFrom: newEffectiveFrom,
      isGovernmentStandard: true,
      version: "v1.1",
    };

    setRules((prev) => [...prev, newRule]);
    setIsAddRuleOpen(false);
    setNewCode("");
    setNewName("");
    setNewDesc("");
    showToast({
      type: "success",
      title: "Aturan Pajak Didaftarkan",
      description: `Aturan ${newCode} (${newName}) dengan tarif ${newRate}% berhasil ditambahkan.`,
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Manajemen", href: "/management/users" },
        { label: "Aturan & Tarif Pajak" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Konfigurasi Mesin Aturan Pajak (Tax Rule Engine)
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pemeliharaan tarif, kode objek pajak, dan masa berlaku aturan perpajakan instansi sekolah
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddRuleOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Aturan</span>
            </button>
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              DEMO RULE ENGINE
            </span>
          </div>
        </div>

        {/* Rules Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Kode Aturan</th>
                  <th className="py-3 px-4">Nama Objek Pajak</th>
                  <th className="py-3 px-4">Jenis Pajak</th>
                  <th className="py-3 px-4 text-center">Tarif Resmi (%)</th>
                  <th className="py-3 px-4">Masa Berlaku</th>
                  <th className="py-3 px-4">Versi Aturan</th>
                  <th className="py-3 px-4 text-center">Aksi Konfigurasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700 dark:text-indigo-400">
                      {rule.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{rule.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{rule.description}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-600 dark:text-slate-300">
                      {rule.taxType}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {editingRuleId === rule.id ? (
                        <input
                          type="number"
                          step="0.1"
                          value={editRate}
                          onChange={(e) => setEditRate(Number(e.target.value))}
                          className="w-16 text-center font-mono font-bold bg-white dark:bg-slate-800 border border-indigo-500 rounded p-1"
                        />
                      ) : (
                        <span className="font-mono font-black text-amber-600 text-sm">
                          {rule.ratePercentage}%
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {rule.effectiveFrom} s/d {rule.effectiveTo || "Seterusnya"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {rule.version}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {editingRuleId === rule.id ? (
                        <button
                          onClick={() => handleSaveEdit(rule.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 mx-auto"
                        >
                          <Check className="w-3 h-3" />
                          Simpan
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(rule)}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center gap-1 mx-auto"
                        >
                          <Edit3 className="w-3 h-3" />
                          Ubah Tarif
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah Aturan */}
        {isAddRuleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pendaftaran Aturan Pajak Baru</h3>
                    <p className="text-[11px] text-slate-500">Konfigurasi parameter aturan dan pemotongan pajak sekolah</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddRuleOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddRule} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Kode Aturan (KOP)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: PPN-BM-11"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Jenis Pajak
                    </label>
                    <select
                      value={newTaxType}
                      onChange={(e) => setNewTaxType(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="PPN">PPN (Pajak Pertambahan Nilai)</option>
                      <option value="PPh 21">PPh 21 (Gaji & Honorarium)</option>
                      <option value="PPh 22">PPh 22 (Belanja Barang BOS)</option>
                      <option value="PPh 23">PPh 23 (Jasa Teknik & Sewa)</option>
                      <option value="PPh 4(2)">PPh Final 4(2) (Sewa Gedung)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Nama Deskripsi Objek Pajak
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Belanja ATK & Sarpras BOS > Rp 2 Juta"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Tarif Pemotongan (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newRate}
                      onChange={(e) => setNewRate(Number(e.target.value))}
                      className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Berlaku Mulai
                    </label>
                    <input
                      type="date"
                      value={newEffectiveFrom}
                      onChange={(e) => setNewEffectiveFrom(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Catatan Dasar Hukum / Keterangan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: PMK No. 59/PMK.03/2022 atas belanja instansi pendidikan..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddRuleOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
                  >
                    Simpan Aturan
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
