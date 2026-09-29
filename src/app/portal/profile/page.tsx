"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Building2, ShieldCheck, Mail, MapPin, Phone, Award, School, Edit3, X, Check } from "lucide-react";
import { formatNPWP } from "@/lib/utils";

export default function ProfileSekolahPage() {
  const { currentUser, schoolProfile, updateSchoolProfile, showToast } = useApp();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form states initialized from schoolProfile
  const [name, setName] = useState(schoolProfile.name);
  const [npsn, setNpsn] = useState(schoolProfile.npsn);
  const [principalName, setPrincipalName] = useState(schoolProfile.principalName);
  const [treasurerName, setTreasurerName] = useState(schoolProfile.treasurerName);
  const [address, setAddress] = useState(schoolProfile.address);
  const [phone, setPhone] = useState(schoolProfile.phone);
  const [email, setEmail] = useState(schoolProfile.email);
  const [accreditation, setAccreditation] = useState(schoolProfile.accreditation || "A");
  const [kppPratama, setKppPratama] = useState(schoolProfile.kppPratama);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile({
      name,
      npsn,
      principalName,
      treasurerName,
      address,
      phone,
      email,
      accreditation,
      kppPratama,
    });
    setIsEditOpen(false);
    showToast({
      type: "success",
      title: "Profil Sekolah Diperbarui",
      description: "Data identitas dan penanggung jawab instansi sekolah telah disimpan ke basis data.",
    });
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Portal Saya", href: "/portal/profile" },
        { label: "Profil Sekolah" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Header Profile Banner */}
        <div className="bg-gradient-to-r from-[#381750] via-purple-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white p-1 ring-2 ring-amber-400 flex items-center justify-center shadow-md overflow-hidden shrink-0">
              <Image
                src="/images/logo-smk.png"
                alt="Logo SMK Bina Putra Jakarta"
                width={64}
                height={64}
                className="w-full h-full object-contain rounded-full"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-purple-950 uppercase tracking-wider">
                  TERAKREDITASI {schoolProfile.accreditation || "A"}
                </span>
                <span className="text-xs text-purple-200">NPSN: {schoolProfile.npsn}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                {schoolProfile.name}
              </h1>
              <p className="text-xs text-purple-200 mt-0.5">
                Yayasan Pendidikan Bina Putra • Wajib Pajak Badan & Instansi Pendidikan
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end md:items-center gap-3">
            <div className="text-right font-mono">
              <p className="text-[11px] text-purple-300">NPWP Instansi Sekolah:</p>
              <p className="text-base sm:text-lg font-black text-amber-300">
                {formatNPWP(schoolProfile.taxId)}
              </p>
            </div>
            <button
              onClick={() => {
                setName(schoolProfile.name);
                setNpsn(schoolProfile.npsn);
                setPrincipalName(schoolProfile.principalName);
                setTreasurerName(schoolProfile.treasurerName);
                setAddress(schoolProfile.address);
                setPhone(schoolProfile.phone);
                setEmail(schoolProfile.email);
                setAccreditation(schoolProfile.accreditation || "A");
                setKppPratama(schoolProfile.kppPratama);
                setIsEditOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs border border-white/20"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Data</span>
            </button>
          </div>
        </div>

        {/* Identity Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Data Pokok Satuan Pendidikan
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">Nama Sekolah:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{schoolProfile.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">NPSN / NSS:</span>
                <span className="font-mono font-semibold">{schoolProfile.npsn} / {schoolProfile.nss}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">Bentuk Pendidikan:</span>
                <span className="font-semibold">{schoolProfile.educationLevel}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">Status Kepemilikan:</span>
                <span className="font-semibold text-purple-700 dark:text-purple-300">{schoolProfile.ownershipStatus}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">KPP Pratama Terdaftar:</span>
                <span className="font-semibold">{schoolProfile.kppPratama}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Status WAPU (Pemungut):</span>
                <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                  {schoolProfile.wapuStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Kontak & Penanggung Jawab Pajak
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">Kepala Sekolah:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{schoolProfile.principalName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">Bendahara Pengeluaran BOS:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{schoolProfile.treasurerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">Alamat Kampus:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 text-right">{schoolProfile.address}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500">Telepon & Email:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{schoolProfile.phone} • {schoolProfile.email}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Sertifikat Elektronik Pajak:</span>
                <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Aktif Valid s/d 2027
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Ubah Data Profil */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Ubah Data Satuan Pendidikan</h3>
                    <p className="text-[11px] text-slate-500">Perbarui informasi identitas, kepala sekolah, dan bendahara</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Nama Sekolah
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      NPSN
                    </label>
                    <input
                      type="text"
                      required
                      value={npsn}
                      onChange={(e) => setNpsn(e.target.value)}
                      className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Nama Kepala Sekolah
                    </label>
                    <input
                      type="text"
                      required
                      value={principalName}
                      onChange={(e) => setPrincipalName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Nama Bendahara BOS
                    </label>
                    <input
                      type="text"
                      required
                      value={treasurerName}
                      onChange={(e) => setTreasurerName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Alamat Lengkap Satuan Pendidikan
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Email Resmi
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      KPP Pratama Terdaftar
                    </label>
                    <input
                      type="text"
                      required
                      value={kppPratama}
                      onChange={(e) => setKppPratama(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Akreditasi
                    </label>
                    <select
                      value={accreditation}
                      onChange={(e) => setAccreditation(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="A">A (Unggul)</option>
                      <option value="B">B (Baik)</option>
                      <option value="C">C (Cukup)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Simpan Perubahan
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
