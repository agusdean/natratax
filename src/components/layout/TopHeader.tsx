"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { 
  Search, 
  Bell, 
  Home, 
  Moon, 
  Sun, 
  ChevronDown, 
  AlertTriangle, 
  UserCheck, 
  LogOut, 
  Settings, 
  Building2, 
  FileText, 
  CheckCircle2, 
  Clock,
  RotateCcw
} from "lucide-react";
import { UserRole } from "@/types";

export const TopHeader: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    availableUsers, 
    notifications, 
    markAllNotificationsRead, 
    clearCacheAndReset,
    isDarkMode, 
    toggleDarkMode, 
    setIsCommandPaletteOpen,
    orgContext,
    switchUnit,
    toggleOperatingMode
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left Section: Logo, Version, Disclaimer (Matching Screenshot 1-5) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            {/* Official School Emblem Avatar */}
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-sm ring-2 ring-amber-400 shrink-0 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo-smk.png"
                alt="Logo SMK Bina Putra Jakarta"
                width={40}
                height={40}
                className="w-full h-full object-contain rounded-full"
                priority
              />
            </div>
            {/* NatraTax Brand Logo Typography */}
            <div className="flex items-baseline">
              <span className="font-extrabold text-2xl italic tracking-tight text-[#1e1b4b] dark:text-purple-300">
                Natra
              </span>
              <span className="font-black text-2xl tracking-tight text-[#f59e0b] ml-0.5">
                Tax
              </span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Versi 1.0
            </span>
          </Link>

          {/* Prominent Amber Disclaimer Badge from Reference */}
          <button
            onClick={() => setIsDisclaimerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f59e0b] hover:bg-[#d97706] text-white font-extrabold text-xs uppercase shadow-sm tracking-wide transition-all transform active:scale-95"
            title="Klik untuk membuka Disclaimer Resmi"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 text-white fill-amber-100 text-amber-700" />
            <span>DISCLAIMER</span>
          </button>
        </div>

        {/* Middle Section: Global Search "Cari Layanan" (Matching Reference) */}
        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <div 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full relative flex items-center bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-1.5 cursor-pointer text-slate-400 text-sm transition-all shadow-2xs"
          >
            <Search className="w-4 h-4 mr-2.5 text-slate-400 shrink-0" />
            <span className="flex-1 text-slate-400 dark:text-slate-400 truncate text-xs sm:text-sm font-normal">
              Cari Layanan
            </span>
          </div>
        </div>

        {/* Right Section: Language, Theme, Notifications, User Card, Home */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile search trigger */}
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            aria-label="Cari Cepat"
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Flag (ID) */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="w-4 h-3 rounded-xs overflow-hidden inline-flex flex-col border border-slate-300 shadow-xs">
              <span className="h-1.5 bg-red-600 w-full" />
              <span className="h-1.5 bg-white w-full" />
            </span>
            <span>ID</span>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              title="Notifikasi Sistem"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Pemberitahuan</span>
                    <span className="text-[10px] px-2 py-0.5 font-bold rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      {unreadNotifs.length} baru
                    </span>
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Tandai dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!n.isRead ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {n.category === 'APPROVAL' && <Clock className="w-4 h-4 text-amber-500" />}
                          {n.category === 'TAX' && <FileText className="w-4 h-4 text-indigo-500" />}
                          {n.category === 'DEADLINE' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          {n.category === 'INFO' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{n.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{n.message}</p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{n.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Impersonation Switcher (Matching Reference Screenshots 1-5) */}
          <div className="relative" ref={userMenuRef}>
            <div className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs">
              <div className="w-6 h-6 rounded-md bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="hidden sm:block text-left leading-tight pr-1">
                <div className="flex items-center gap-1">
                  {currentUser.role === "MITRA" && (
                    <span className="px-1 py-0.2 rounded text-[8px] font-extrabold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      MITRA
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold tracking-tight">
                    {currentUser.taxId}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate max-w-[145px]">
                  {currentUser.name.length > 18 ? currentUser.name.slice(0, 17) + "..." : currentUser.name}
                </div>
              </div>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-indigo-300 dark:border-indigo-700/80 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 text-[11px] font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors shadow-2xs"
              >
                <span>{currentUser.role === "MITRA" ? "Mitra" : "Akun"}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">
                    {currentUser.role === "MITRA" ? "Mitra Rekanan / DU-DI Terdaftar" : "Pengguna Terautentikasi"}
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{currentUser.taxId}</p>
                  <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">{currentUser.schoolName}</p>
                </div>

                {/* Organization & Unit Switcher (Point 3) */}
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-indigo-500" />
                      Unit Organisasi Aktif
                    </p>
                    <button
                      onClick={toggleOperatingMode}
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        orgContext.operatingMode === "PRACTICUM_SANDBOX"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {orgContext.operatingMode === "PRACTICUM_SANDBOX" ? "Sandbox" : "Live"}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: "UNIT-FIN-01", name: "Keuangan & Perpajakan BOS" },
                      { id: "UNIT-TEFA-02", name: "Unit Produksi & TEFA" },
                      { id: "UNIT-YYS-03", name: "Yayasan & Sarana Sekolah" },
                      { id: "UNIT-LAB-04", name: "Laboratorium & Bengkel" },
                    ].map((u) => (
                      <button
                        key={u.id}
                        onClick={() => switchUnit(u.id)}
                        className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition-colors ${
                          orgContext.unitId === u.id
                            ? "bg-indigo-50 dark:bg-indigo-950/70 font-bold text-indigo-900 dark:text-indigo-200"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        {orgContext.unitId === u.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* RBAC Role Switcher (Point 22) */}
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-amber-500" />
                    Beralih Peran (RBAC)
                  </p>
                  <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto">
                    {[
                      "SUPER ADMIN",
                      "KEPALA SEKOLAH",
                      "BENDAHARA",
                      "ADMIN PAJAK",
                      "VERIFIKATOR",
                      "OPERATOR",
                      "AUDITOR",
                      "INSTRUCTOR",
                      "STUDENT",
                      "MITRA",
                    ].map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          switchRole(role as UserRole);
                          setIsUserMenuOpen(false);
                        }}
                        className={`px-2 py-1 rounded text-[10px] text-left truncate font-semibold transition-colors ${
                          currentUser.role === role
                            ? "bg-amber-100 dark:bg-amber-950 font-bold text-amber-950 dark:text-amber-200 border border-amber-300"
                            : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {role === "INSTRUCTOR" ? "Instruktur" : role === "STUDENT" ? "Siswa" : role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/portal/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Building2 className="w-4 h-4 text-slate-400" />
                    Profil Satuan Pendidikan
                  </Link>
                  <Link
                    href="/management/tax-rules"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Konfigurasi Pajak & Aturan
                  </Link>
                  <button
                    onClick={() => {
                      clearCacheAndReset();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-500" />
                    Bersihkan Cache & Reset Bersih
                  </button>
                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar Sesi
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Home Icon Button (Matching Screenshot Top Right) */}
          <Link
            href="/dashboard"
            title="Beranda Portal"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Disclaimer Modal */}
      {isDisclaimerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pemberitahuan & Disclaimer Resmi
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  NatraTax Versi 1.0 • Sistem Administrasi Pajak SMK BINA PUTRA JAKARTA
                </p>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 font-medium">
                Sistem ini merupakan lingkungan simulasi perpajakan resmi yang didesain mengikuti spesifikasi dan tata kelola Core Tax Administration System (Coretax) Direktorat Jenderal Pajak untuk Satuan Pendidikan Menengah Kejuruan (SMK).
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
                <li>Seluruh nomor bukti potong, kode billing, dan sertifikat elektronik bersifat simulasi pembelajaran internal.</li>
                <li>Pencatatan faktur pajak dan SPT masa terintegrasi dengan penatausahaan Buku Kas Umum (BKU) BOS satuan pendidikan.</li>
                <li>Tidak terdapat pemotongan saldo riil dari perbankan eksternal selain pencatatan audit trail internal sekolah.</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsDisclaimerOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs transition-colors"
              >
                Saya Mengerti & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
