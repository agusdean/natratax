import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, FileCheck, HelpCircle } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs py-8">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white p-0.5 shadow-xs ring-1 ring-amber-400 shrink-0 overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/logo-smk.png"
                  alt="Logo SMK Bina Putra Jakarta"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm">
                Natra<span className="text-amber-500">Tax</span>
              </span>
              <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
              <span className="font-medium">Smart School Tax Administration</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              SMK BINA PUTRA JAKARTA
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
              Version 1.0
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-[11px] font-medium">
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Kebijakan Privasi
            </Link>
            <Link href="/security" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" />
              Keamanan Data
            </Link>
            <Link href="/terms" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Syarat & Ketentuan
            </Link>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>© 2026 NatraTax. Hak Cipta Dilindungi Undang-Undang. Sistem Administrasi Internal Pendidikan.</p>
          <p className="text-amber-600 dark:text-amber-400 font-medium">
            Bukan Portal Resmi DJP/Coretax • Khusus Pengelolaan Finansial & Pajak Internal Sekolah
          </p>
        </div>
      </div>
    </footer>
  );
};
