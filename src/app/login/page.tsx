"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { 
  Building2, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Users,
  KeyRound,
  Sparkles,
  X,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, availableUsers, addUser, showToast } = useApp();

  const [username, setUsername] = useState("998866000010609");
  const [password, setPassword] = useState("Admin123!");
  const [showPassword, setShowPassword] = useState(false);
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regNip, setRegNip] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("OPERATOR");
  const [regDept, setRegDept] = useState("Staff Administrasi BOS");

  // Activation Form State
  const [actTaxId, setActTaxId] = useState("");
  const [actCode, setActCode] = useState("");
  const [actNewPassword, setActNewPassword] = useState("");

  // Reset Password State
  const [resetIdentity, setResetIdentity] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaChecked) {
      showToast({
        type: "warning",
        title: "Verifikasi Keamanan",
        description: "Harap centang verifikasi 'Saya bukan robot'.",
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast({
        type: "success",
        title: "Login Berhasil",
        description: "Selamat datang di NatraTax SMK BINA PUTRA JAKARTA.",
      });
      router.push("/dashboard");
    }, 500);
  };

  const handleQuickLoginAdmin = () => {
    switchRole("BENDAHARA");
    showToast({
      type: "success",
      title: "Login Admin Berhasil",
      description: "Masuk sebagai Administrator Perpajakan & Bendahara Sekolah.",
    });
    router.push("/dashboard");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;

    addUser({
      name: regName,
      email: regEmail,
      role: regRole,
      taxId: regNip || "9988660000" + Math.floor(10000 + Math.random() * 90000),
      schoolName: "SMK BINA PUTRA JAKARTA",
      department: regDept,
    });

    setIsRegisterOpen(false);
    setRegName("");
    setRegNip("");
    setRegEmail("");
    showToast({
      type: "success",
      title: "Pendaftaran Berhasil",
      description: `Akun ${regName} (${regRole}) telah didaftarkan ke sistem dan siap diproses oleh Administrator.`,
    });
  };

  const handleActivateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTaxId || !actCode) return;

    setIsActivateOpen(false);
    setActTaxId("");
    setActCode("");
    setActNewPassword("");
    showToast({
      type: "success",
      title: "Aktivasi Akun Berhasil",
      description: "Akun Wajib Pajak Anda telah aktif dan kata sandi baru telah ditetapkan. Silakan login.",
    });
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentity) return;

    setIsResetOpen(false);
    setResetIdentity("");
    showToast({
      type: "info",
      title: "Permintaan Reset Terkirim",
      description: `Tautan pemulihan kata sandi telah dikirimkan ke email terdaftar instansi untuk ID: ${resetIdentity}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-200 dark:from-slate-950 dark:via-indigo-950/30 dark:to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Brand Promo Banner */}
        <div className="lg:col-span-6 p-8 sm:p-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            {/* Brand Logo Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  Natra<span className="text-amber-400">Tax</span>
                </span>
                <p className="text-[10px] text-purple-200 tracking-wider uppercase font-semibold">
                  SMK BINA PUTRA JAKARTA
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Administrasi & Praktikum Pajak Sekolah Terpadu
              </h1>
              <div className="w-16 h-1.5 bg-amber-400 rounded-full" />
            </div>

            {/* Feature Card Preview */}
            <div className="mt-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-purple-950">
                  PORTAL RESMI
                </span>
                <span className="text-xs text-purple-200 font-medium">Kepatuhan Pajak BOS</span>
              </div>
              
              <ul className="space-y-2.5 text-xs text-purple-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pengelolaan Faktur Masukan & Keluaran BOS</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>e-Bupot Unifikasi Pasal 21, 22, 23, & 4(2)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Penyusunan & Pengesahan SPT Masa Sekolah</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pembuatan Kode Billing & Validasi NTPN Kas Negara</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Left Footer Action */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
            <button 
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Daftar sebagai Staf / Guru Baru</span>
            </button>
            <span className="text-[11px] text-purple-300 font-mono">v1.2 Clean</span>
          </div>

        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Selamat Datang!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Masuk untuk membuka dan memproses akun perpajakan SMK BINA PUTRA JAKARTA.
              </p>
            </div>

            {/* Single Admin Credential Badge */}
            <div className="mb-5 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Akun Administrator Utama:
                </span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  ID: <span className="text-indigo-600 dark:text-indigo-400">998866000010609</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Sandi: <span className="font-mono font-semibold">Admin123!</span> (Bendahara & WAPU)
                </p>
              </div>
              <button
                type="button"
                onClick={handleQuickLoginAdmin}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-sm transition-all shrink-0"
              >
                Masuk Cepat
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              
              {/* ID Pengguna */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ID Pengguna / NPWP Instansi
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan NPWP atau ID Pengguna"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Verifikasi Captcha & Reset Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <input
                    type="checkbox"
                    checked={isCaptchaChecked}
                    onChange={(e) => setIsCaptchaChecked(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Saya bukan robot
                  </span>
                </label>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Lupa Kata Sandi?</span>
                  <button
                    type="button"
                    onClick={() => setIsResetOpen(true)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Reset Password
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-sm shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? "Memverifikasi Kredensial..." : "Masuk ke Sistem"}
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>

          {/* Quick Registration & Activation Footer Pills */}
          <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <p className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                  Pengguna Baru
                </p>
                <p className="text-[10px] text-slate-400">Daftar Akun Sekolah</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => setIsActivateOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <p className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                  Belum Aktivasi?
                </p>
                <p className="text-[10px] text-slate-400">Aktivasi Akun Wajib Pajak</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

        </div>

      </div>

      {/* MODAL 1: PENDAFTARAN PENGGUNA BARU */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pendaftaran Pengguna Sekolah Baru</h3>
                  <p className="text-[11px] text-slate-500">Daftarkan akun staf/guru untuk diproses oleh Administrator</p>
                </div>
              </div>
              <button onClick={() => setIsRegisterOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rina Widiawati, S.Pd"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIP / NIK (16 Digit)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 3175081203850001"
                    value={regNip}
                    onChange={(e) => setRegNip(e.target.value)}
                    className="w-full font-mono px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Satuan Pendidikan
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@binaputra.sch.id"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Peran Diajukan
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="OPERATOR">Operator BOS / Tata Usaha</option>
                    <option value="ADMIN PAJAK">Admin Pajak & e-Faktur</option>
                    <option value="VERIFIKATOR">Verifikator Satuan Pengawas</option>
                    <option value="KEPALA SEKOLAH">Pimpinan / Kepala Sekolah</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Unit / Bagian Kerja
                  </label>
                  <input
                    type="text"
                    required
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
                Pendaftaran akun akan langsung masuk ke basis data pengguna satuan pendidikan dan dapat dikelola langsung oleh Administrator Utama di menu Manajemen Pengguna.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  Kirim Pendaftaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: AKTIVASI AKUN WAJIB PAJAK */}
      {isActivateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Aktivasi Akun Wajib Pajak</h3>
                  <p className="text-[11px] text-slate-500">Validasi kode aktivasi tugas bendahara/guru</p>
                </div>
              </div>
              <button onClick={() => setIsActivateOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleActivateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Pokok Wajib Pajak (NPWP 16 Digit / NIK)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 998866000010609"
                  value={actTaxId}
                  onChange={(e) => setActTaxId(e.target.value)}
                  className="w-full font-mono px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Aktivasi (Dari Surat Keputusan Sekolah)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: AKTIF-BOS-2026"
                  value={actCode}
                  onChange={(e) => setActCode(e.target.value)}
                  className="w-full font-mono px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Buat Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 8 karakter kombinasi huruf & angka"
                  value={actNewPassword}
                  onChange={(e) => setActNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsActivateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  Aktivasi Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RESET PASSWORD */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Reset Kata Sandi Akun</h3>
                  <p className="text-[11px] text-slate-500">Pemulihan akses akun resmi satuan pendidikan</p>
                </div>
              </div>
              <button onClick={() => setIsResetOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Masukkan NPWP / NIK atau Email Terdaftar
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 998866000010609 atau admin@binaputra.sch.id"
                  value={resetIdentity}
                  onChange={(e) => setResetIdentity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Petunjuk pemulihan kata sandi akan dikirimkan ke email resmi yang tertaut dengan akun sekolah SMK Bina Putra Jakarta.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  Kirim Petunjuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
