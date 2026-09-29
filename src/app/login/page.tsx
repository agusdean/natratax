"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Check, 
  ChevronRight, 
  Users, 
  KeyRound, 
  X, 
  Building2, 
  Phone, 
  Mail, 
  Briefcase,
  Sparkles,
  Play
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, availableUsers, addUser, addMitra, showToast } = useApp();

  const [username, setUsername] = useState("998866000010609");
  const [password, setPassword] = useState("Admin123!");
  const [showPassword, setShowPassword] = useState(false);
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isMitraModalOpen, setIsMitraModalOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // Mitra Registration State
  const [mitraCompany, setMitraCompany] = useState("");
  const [mitraPic, setMitraPic] = useState("");
  const [mitraNpwp, setMitraNpwp] = useState("");
  const [mitraCategory, setMitraCategory] = useState("Mitra Industri (DU/DI) & Vokasi");
  const [mitraEmail, setMitraEmail] = useState("");
  const [mitraPhone, setMitraPhone] = useState("");
  const [mitraPassword, setMitraPassword] = useState("");
  const [mitraAddress, setMitraAddress] = useState("");

  // School Staff Registration State
  const [regName, setRegName] = useState("");
  const [regNip, setRegNip] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState<UserRole>("OPERATOR");
  const [regDept, setRegDept] = useState("Staff Administrasi BOS");

  // Activation State
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

      // Check if credentials match a Mitra account
      const cleanUser = username.trim().toLowerCase();
      const existingMitra = availableUsers.find(
        (u) =>
          u.role === "MITRA" &&
          (u.taxId === cleanUser || u.email.toLowerCase() === cleanUser)
      );

      if (existingMitra) {
        switchRole("MITRA");
        showToast({
          type: "success",
          title: "Login Mitra Berhasil",
          description: `Selamat datang di Portal Kemitraan: ${existingMitra.name}.`,
        });
        router.push("/dashboard");
        return;
      }

      if (cleanUser.includes("mitra") || cleanUser.startsWith("01.234")) {
        switchRole("MITRA");
        showToast({
          type: "success",
          title: "Login Mitra Berhasil",
          description: "Selamat datang di Portal Kemitraan DU/DI & Rekanan NatraTax.",
        });
        router.push("/dashboard");
        return;
      }

      // Default Admin / Internal staff login
      switchRole("SUPER ADMIN");
      showToast({
        type: "success",
        title: "Login Berhasil",
        description: "Selamat datang di NatraTax SMK BINA PUTRA JAKARTA.",
      });
      router.push("/dashboard");
    }, 450);
  };

  const handleQuickFillAdmin = () => {
    setUsername("998866000010609");
    setPassword("Admin123!");
    showToast({
      type: "info",
      title: "Akun Super Admin Diisi",
      description: "ID: 998866000010609 siap masuk.",
    });
  };

  const handleQuickFillMitra = () => {
    setUsername("01.234.567.8-012.000");
    setPassword("Mitra123!");
    showToast({
      type: "info",
      title: "Akun Mitra DU/DI Diisi",
      description: "ID Mitra: 01.234.567.8-012.000 (PT Mitra Industri Karya).",
    });
  };

  const handleMitraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mitraCompany || !mitraEmail) return;

    const newMitra = addMitra({
      companyName: mitraCompany,
      picName: mitraPic || "Koordinator Kemitraan",
      npwp: mitraNpwp || "01.234.567.8-012.000",
      category: mitraCategory,
      email: mitraEmail,
      phone: mitraPhone || "081298765432",
      address: mitraAddress || "Jakarta",
    });

    setIsMitraModalOpen(false);
    setMitraCompany("");
    setMitraPic("");
    setMitraNpwp("");
    setMitraEmail("");
    setMitraPhone("");
    setMitraPassword("");
    setMitraAddress("");

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
      description: `Akun ${regName} (${regRole}) telah didaftarkan ke sistem dan siap diproses Administrator.`,
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
      description: `Tautan pemulihan kata sandi telah dikirimkan ke email terdaftar untuk ID: ${resetIdentity}.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden font-sans">
      
      {/* ──────────────────────────────────────────────────────────
          3D Abstract Silk Wavy Curves Background (Matching Image 2)
          ────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg
          className="absolute -right-20 -bottom-20 w-[1100px] h-[900px] opacity-40 text-slate-300/70"
          viewBox="0 0 1000 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M200 800C350 650 400 450 600 500C800 550 850 350 950 200C1050 50 1100 0 1100 0V800H200Z"
            fill="url(#wave-grad-1)"
          />
          <path
            d="M100 800C280 620 450 520 620 620C790 720 890 480 1050 300C1150 180 1200 100 1200 100V800H100Z"
            fill="url(#wave-grad-2)"
            fillOpacity="0.6"
          />
          <defs>
            <linearGradient id="wave-grad-1" x1="600" y1="200" x2="1000" y2="800" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E2E8F0" />
              <stop offset="1" stopColor="#CBD5E1" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="400" y1="300" x2="900" y2="800" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EEF2F6" />
              <stop offset="1" stopColor="#E2E8F0" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient soft glow on top left */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
        {/* Ambient soft glow on center right */}
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-slate-200/40 rounded-full blur-2xl" />
      </div>

      {/* ──────────────────────────────────────────────────────────
          Main Container: 2 Columns Layout (Matching Image 2)
          ────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6">
        
        {/* ══════════════════════════════════════════════════════════
            LEFT COLUMN: Logo, Headline, Feature Card & Daftar Mitra
            ══════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          
          {/* Brand Logo Header (Styled identical to PrakTax logo format) */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-5 w-fit group">
            <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-sm ring-1 ring-amber-400 shrink-0 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo-smk.png"
                alt="Logo SMK Bina Putra Jakarta"
                width={36}
                height={36}
                className="w-full h-full object-contain rounded-full"
                priority
              />
            </div>
            <div className="flex items-baseline tracking-tight">
              <span className="font-extrabold text-2xl italic tracking-tight text-[#142878]">
                Natra
              </span>
              <span className="font-black text-2xl tracking-tight text-[#F59E0B] ml-0.5">
                Tax
              </span>
            </div>
          </Link>

          {/* Main Headline (Identical to Image 2) */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142878] tracking-tight leading-[1.2]">
            Yukk Praktikum Pajak<br />
            Sekarang
          </h1>
          {/* Horizontal Accent Line under Sekarang */}
          <div className="w-16 h-1.5 bg-[#F59E0B] rounded-full mt-2.5 mb-6" />

          {/* Feature Promo Card: "Update Tampilan" (Identical to Image 2) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-5 max-w-[420px] relative">
            <h2 className="text-lg font-extrabold text-[#142878] mb-3">
              Update <span className="text-[#F59E0B]">Tampilan</span>
            </h2>

            {/* Inner Sub-Card Preview */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-4 relative overflow-hidden">
              
              {/* Red Diagonal Badge "NEW" in top-left */}
              <div className="absolute top-0 left-0">
                <div className="bg-[#EF4444] text-white font-extrabold text-[10px] tracking-wider uppercase px-3 py-1 rounded-br-xl shadow-xs">
                  NEW
                </div>
              </div>

              {/* Graphic Illustration Mockup */}
              <div className="flex items-center gap-3 pt-4 pb-2">
                {/* Laptop Mockup */}
                <div className="w-36 bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden">
                  <div className="h-3 bg-[#142878] flex items-center px-1.5 gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  </div>
                  <div className="p-2 text-center bg-slate-50/50">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-1">
                      <Play className="w-3 h-3 fill-amber-500 text-amber-500 ml-0.5" />
                    </div>
                    <p className="text-[9px] font-bold text-slate-800 leading-tight">Perpajakan Dasar</p>
                    <p className="text-[7px] text-slate-400">SMK Bina Putra</p>
                  </div>
                </div>

                {/* Mobile Mockup */}
                <div className="w-14 h-20 bg-white border border-slate-300 rounded-lg shadow-xs p-1 flex flex-col justify-between">
                  <div className="w-4 h-1 bg-slate-200 rounded-full mx-auto" />
                  <div className="space-y-1">
                    <div className="h-1.5 bg-indigo-100 rounded-sm" />
                    <div className="h-1.5 bg-amber-100 rounded-sm" />
                    <div className="h-1.5 bg-slate-100 rounded-sm" />
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200 mx-auto" />
                </div>
              </div>

              {/* 4 Feature Checklist Items with Orange Circles (Identical to Image 2) */}
              <div className="space-y-2 mt-2 pt-2 border-t border-slate-200/70 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Simulasi dan latihan perpajakan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Interaktif dan mudah dipahami</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Materi lengkap dan akurat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Praktikum berbasis kasus nyata</span>
                </div>
              </div>

              {/* Orange Pill Button at bottom of card (Identical to Image 2) */}
              <div className="mt-3.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white text-[10.5px] font-medium py-1.5 px-3 rounded-full text-center shadow-xs">
                Langsung masuk, untuk praktikum pajak yang lebih nyata
              </div>

            </div>
          </div>

          {/* Bottom Button: "Daftar sebagai Mitra" (Identical to Image 2) */}
          <button
            type="button"
            onClick={() => setIsMitraModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E1A66] hover:bg-[#241352] text-white text-xs font-bold shadow-md transition-all active:scale-95 w-fit"
          >
            <Users className="w-4 h-4 text-white" />
            <span>Daftar sebagai Mitra</span>
          </button>

        </div>

        {/* ══════════════════════════════════════════════════════════
            RIGHT COLUMN: Login Card (Floating White Container)
            ══════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 flex justify-center">
          
          <div className="bg-white rounded-2xl p-7 sm:p-9 shadow-xl border border-slate-100 max-w-[430px] w-full">
            
            {/* Header: Selamat Datang! */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142878] tracking-tight">
              Selamat Datang!
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
              Langsung masuk, untuk praktikum pajak yang lebih nyata
            </p>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* ID Pengguna */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  ID Pengguna
                </label>
                <div className="relative border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-[#142878] focus-within:border-[#142878] bg-white flex items-center overflow-hidden transition-all">
                  <div className="pl-3.5 pr-2.5 text-slate-400 flex items-center border-r border-slate-200 py-2.5">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ID Pengguna"
                    className="w-full px-3 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Password
                </label>
                <div className="relative border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-[#142878] focus-within:border-[#142878] bg-white flex items-center overflow-hidden transition-all">
                  <div className="pl-3.5 pr-2.5 text-slate-400 flex items-center py-2.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-2.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Verifikasi */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Verifikasi
                </label>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/70 hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={isCaptchaChecked}
                      onChange={(e) => setIsCaptchaChecked(e.target.checked)}
                      className="w-4 h-4 text-[#142878] rounded border-slate-300 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[11px] font-medium text-slate-700 select-none">
                      Saya bukan robot
                    </span>
                  </label>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Lupa Kata Sandi?</span>
                    <button
                      type="button"
                      onClick={() => setIsResetOpen(true)}
                      className="text-xs font-bold text-[#142878] underline hover:text-[#0f1f5e] transition-colors"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button: "Masuk" (Identical to Image 2) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#142878] hover:bg-[#0f1f5e] text-white font-bold text-sm shadow-md transition-all mt-4 active:scale-[0.99] disabled:opacity-75"
              >
                {isLoading ? "Memproses Kredensial..." : "Masuk"}
              </button>

            </form>

            {/* Divider: ATAU (Identical to Image 2) */}
            <div className="text-center my-3.5 text-[11px] font-bold text-slate-400 tracking-wider">
              ATAU
            </div>

            {/* Bottom Action Cards (Identical to Image 2) */}
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Card 1: Pengguna Baru / Daftar Disini */}
              <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[11px] text-slate-800 group-hover:text-[#142878]">
                      Pengguna Baru
                    </p>
                    <p className="text-[10px] text-slate-400">Daftar Disini</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {/* Card 2: Belum Aktivasi? / Aktivasi Akun Wajib Pajak */}
              <button
                type="button"
                onClick={() => setIsActivateOpen(true)}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all flex items-center justify-between group text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[11px] text-slate-800 group-hover:text-[#142878]">
                      Belum Aktivasi?
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[80px]">Aktivasi Akun WP</p>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

            </div>

            {/* Discreet Quick-Fill Pill for Testing / Evaluation */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-medium">Isi Kredensial Cepat:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleQuickFillAdmin}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                  title="Isi ID Super Admin"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={handleQuickFillMitra}
                  className="px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold transition-colors"
                  title="Isi ID Mitra DU/DI"
                >
                  Mitra DU/DI
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════
          MODAL 1: DAFTAR SEBAGAI MITRA (PRAKTAX / NATRATAX PARTNER)
          ══════════════════════════════════════════════════════════ */}
      {isMitraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2E1A66] text-white flex items-center justify-center font-bold shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Pendaftaran Mitra Kerjasama
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Kemitraan Industri DU/DI, Rekanan Pengadaan BOS & Vokasi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMitraModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMitraSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Perusahaan / Instansi Mitra
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT Telkom Akses / CV Rekanan Mandiri"
                    value={mitraCompany}
                    onChange={(e) => setMitraCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#142878]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso, S.T."
                    value={mitraPic}
                    onChange={(e) => setMitraPic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#142878]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NPWP / NIK Mitra
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 01.234.567.8-012.000"
                    value={mitraNpwp}
                    onChange={(e) => setMitraNpwp(e.target.value)}
                    className="w-full font-mono px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#142878]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kategori Kemitraan
                </label>
                <select
                  value={mitraCategory}
                  onChange={(e) => setMitraCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#142878] bg-white cursor-pointer"
                >
                  <option value="Mitra Industri (DU/DI) & Vokasi">
                    Mitra Industri (DU/DI) — Insentif Super Tax Deduction 200%
                  </option>
                  <option value="Mitra Penyedia & Rekanan BOS">
                    Mitra Penyedia & Rekanan BOS — e-Faktur & e-Bupot Terpadu
                  </option>
                  <option value="Mitra Instruktur / Penguji UKK">
                    Mitra Instruktur / Penguji UKK & Tenaga Ahli (PPh 21)
                  </option>
                  <option value="Sekolah / Lembaga Rekanan Praktikum">
                    Sekolah / Lembaga Rekanan Praktikum Pajak
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Resmi Kemitraan
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="kemitraan@perusahaan.co.id"
                    value={mitraEmail}
                    onChange={(e) => setMitraEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#142878]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / Kontak
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="081298765432"
                    value={mitraPhone}
                    onChange={(e) => setMitraPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#142878]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kata Sandi Akun Mitra
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 8 karakter kombinasi"
                  value={mitraPassword}
                  onChange={(e) => setMitraPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#142878]"
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-[11px] text-purple-900 leading-relaxed">
                Pendaftaran mitra akan langsung terhubung dengan rekening operasional BOS dan portal e-Faktur/e-Bupot SMK Bina Putra Jakarta.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMitraModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2E1A66] hover:bg-[#241352] text-white text-xs font-bold shadow-md transition-all"
                >
                  Daftarkan Mitra Sekarang
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL 2: PENDAFTARAN PENGGUNA BARU (DAFTAR DISINI)
          ══════════════════════════════════════════════════════════ */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#142878] flex items-center justify-center font-bold">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Pendaftaran Pengguna Baru</h3>
                  <p className="text-[11px] text-slate-500">Daftarkan akun staf/guru untuk diproses oleh Administrator</p>
                </div>
              </div>
              <button onClick={() => setIsRegisterOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rina Widiawati, S.Pd"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#142878]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIP / NIK (16 Digit)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 3175081203850001"
                    value={regNip}
                    onChange={(e) => setRegNip(e.target.value)}
                    className="w-full font-mono px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#142878]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Satuan Pendidikan
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@binaputra.sch.id"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#142878]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Peran Diajukan
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#142878]"
                  >
                    <option value="OPERATOR">Operator BOS / Tata Usaha</option>
                    <option value="ADMIN PAJAK">Admin Pajak & e-Faktur</option>
                    <option value="VERIFIKATOR">Verifikator Satuan Pengawas</option>
                    <option value="KEPALA SEKOLAH">Pimpinan / Kepala Sekolah</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Unit / Bagian Kerja
                  </label>
                  <input
                    type="text"
                    required
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[#142878]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#142878] hover:bg-[#0f1f5e] text-white text-xs font-bold shadow-md transition-all"
                >
                  Kirim Pendaftaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL 3: AKTIVASI AKUN WAJIB PAJAK
          ══════════════════════════════════════════════════════════ */}
      {isActivateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Aktivasi Akun Wajib Pajak</h3>
                  <p className="text-[11px] text-slate-500">Validasi kode aktivasi tugas bendahara/guru</p>
                </div>
              </div>
              <button onClick={() => setIsActivateOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleActivateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor Pokok Wajib Pajak (NPWP 16 Digit / NIK)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 998866000010609"
                  value={actTaxId}
                  onChange={(e) => setActTaxId(e.target.value)}
                  className="w-full font-mono px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kode Aktivasi (Dari Surat Keputusan Sekolah)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: AKTIF-BOS-2026"
                  value={actCode}
                  onChange={(e) => setActCode(e.target.value)}
                  className="w-full font-mono px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Buat Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 8 karakter kombinasi"
                  value={actNewPassword}
                  onChange={(e) => setActNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsActivateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
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

      {/* ══════════════════════════════════════════════════════════
          MODAL 4: RESET PASSWORD
          ══════════════════════════════════════════════════════════ */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Reset Kata Sandi Akun</h3>
                  <p className="text-[11px] text-slate-500">Pemulihan akses akun resmi satuan pendidikan</p>
                </div>
              </div>
              <button onClick={() => setIsResetOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Masukkan NPWP / NIK atau Email Terdaftar
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 998866000010609 atau admin@binaputra.sch.id"
                  value={resetIdentity}
                  onChange={(e) => setResetIdentity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Petunjuk pemulihan kata sandi akan dikirimkan ke email resmi yang tertaut dengan akun sekolah SMK Bina Putra Jakarta.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100"
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
