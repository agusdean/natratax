"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { 
  LayoutDashboard, 
  FileText, 
  FileCheck2, 
  Files, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Ban, 
  Building2, 
  CreditCard, 
  BookOpen, 
  Users, 
  ShieldAlert, 
  Scale, 
  CalendarClock,
  Sparkles,
  HelpCircle,
  FolderOpen
} from "lucide-react";

interface SubmenuSection {
  title?: string;
  items: {
    label: string;
    href: string;
    icon?: React.ElementType;
    badge?: string;
  }[];
}

const ContextSidebarContent: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentUser } = useApp();

  const isItemActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href.includes("?")) {
      const [path, query] = href.split("?");
      if (pathname !== path) return false;
      const targetQuery = new URLSearchParams(query);
      let allMatch = true;
      targetQuery.forEach((val, key) => {
        if (searchParams.get(key) !== val) allMatch = false;
      });
      return allMatch;
    }
    if (href.includes("#")) {
      const path = href.split("#")[0];
      return pathname === path;
    }
    return pathname === href;
  };

  // Determine current active module from route
  const getSubmenuConfig = (): { groupTitle: string; sections: SubmenuSection[] } => {
    // MITRA Role Dedicated Portal View
    if (currentUser.role === "MITRA" && (pathname === "/dashboard" || pathname.startsWith("/portal/mitra"))) {
      return {
        groupTitle: "Portal Kemitraan & Rekanan",
        sections: [
          {
            title: "Layanan Kemitraan",
            items: [
              { label: "Dasbor Kemitraan", href: "/dashboard", icon: LayoutDashboard },
              { label: "Faktur Kemitraan / DU-DI", href: "/invoices/outgoing", icon: FileText },
              { label: "Bukti Potong Pajak Saya", href: "/bupot", icon: FileCheck2 },
              { label: "Insentif Super Tax Vokasi 200%", href: "/layanan/fasilitas-saya", icon: Sparkles },
              { label: "Rekonsiliasi Rekanan BOS", href: "/ledger#rekon", icon: Scale },
              { label: "Dokumen Perjanjian Kerjasama", href: "/portal/documents", icon: FolderOpen },
            ],
          },
        ],
      };
    }

    // Screenshot 1: e-Faktur Sidebar exactly matching Faktur & Dokumen Lain
    if (pathname.startsWith("/invoices")) {
      return {
        groupTitle: "e-Faktur",
        sections: [
          {
            title: "Faktur",
            items: [
              { label: "Pajak Keluaran", href: "/invoices/outgoing", icon: FileText },
              { label: "Pajak Masukan", href: "/invoices/incoming", icon: FileText },
              { label: "Retur Pajak Keluaran", href: "/invoices/retur-keluaran", icon: FileText },
              { label: "Retur Pajak Masukan", href: "/invoices/retur-masukan", icon: FileText },
            ],
          },
          {
            title: "Dokumen Lain",
            items: [
              { label: "Pajak Keluaran", href: "/invoices/dokumen-lain-keluaran", icon: FileText },
              { label: "Pajak Masukan", href: "/invoices/dokumen-lain-masukan", icon: FileText },
              { label: "Retur Dokumen Lain Keluaran", href: "/invoices/retur-dokumen-keluaran", icon: FileText },
              { label: "Retur Dokumen Lain Masukan", href: "/invoices/retur-dokumen-masukan", icon: FileText },
            ],
          },
        ],
      };
    }

    // Screenshot 3: SPT Sidebar
    if (pathname.startsWith("/spt")) {
      return {
        groupTitle: "Surat Pemberitahuan (SPT)",
        sections: [
          {
            title: "Surat Pemberitahuan (SPT)",
            items: [
              { label: "Surat Pemberitahuan (SPT)", href: "/spt", icon: Files },
              { label: "Coretax Form", href: "/spt/coretax-form", icon: FileCheck2 },
              { label: "Pencatatan", href: "/spt/pencatatan", icon: BookOpen },
              { label: "Dasbor Kompensasi", href: "/spt/kompensasi", icon: Scale },
              { label: "Pengungkapan Ketidakbenaran SPT", href: "/spt/pengungkapan", icon: ShieldAlert },
            ],
          },
          {
            title: "Status SPT Masa",
            items: [
              { label: "Menunggu Pembayaran", href: "/spt?status=MENUNGGU_PEMBAYARAN", icon: Clock },
              { label: "Siap Diproses", href: "/spt?status=SIAP_PROSES", icon: FileCheck2 },
              { label: "Dilaporkan (BPE)", href: "/spt?status=DILAPORKAN", icon: CheckCircle },
            ],
          },
        ],
      };
    }

    // e-Bupot Sidebar
    if (pathname.startsWith("/bupot")) {
      return {
        groupTitle: "Bukti Potong (e-Bupot)",
        sections: [
          {
            title: "Bukti Pemotongan Pajak",
            items: [
              { label: "Bukti Potong Saya", href: "/bupot", icon: FileCheck2 },
              { label: "BP 21 - Guru & Asesor", href: "/bupot?type=BP21", badge: "GTT" },
              { label: "BPPU - PPh 22 & 23", href: "/bupot?type=BPPU" },
              { label: "BPNR - Bukan Pegawai Non Residen", href: "/bupot?type=BPNR" },
              { label: "Penyetoran Sendiri", href: "/bupot?type=Penyetoran" },
              { label: "Pemotongan Secara Digunggung", href: "/bupot?type=Digunggung" },
              { label: "BP A1 - Tahunan Guru Tetap", href: "/bupot?type=A1" },
              { label: "BP A2 - Bukti Potong ASN/PNS", href: "/bupot?type=A2" },
            ],
          },
        ],
      };
    }

    // Screenshot 5: Pembayaran Sidebar
    if (pathname.startsWith("/payments")) {
      return {
        groupTitle: "Pembayaran",
        sections: [
          {
            title: "Pembayaran",
            items: [
              { label: "Tagihan & NTPN Pajak", href: "/payments", icon: CreditCard },
              { label: "Permohonan Pemindahbukuan", href: "/payments/pemindahbukuan", icon: FileText },
              { label: "Layanan Mandiri Kode Billing", href: "/payments/kode-billing", icon: CreditCard },
              { label: "Billing Atas Tagihan Pajak", href: "/payments/billing-tagihan", icon: Clock },
              { label: "Kode Billing Belum Dibayar", href: "/payments/billing-unpaid", icon: Ban },
              { label: "Formulir Restitusi Pajak", href: "/payments/restitusi", icon: CheckCircle },
              { label: "Permohonan Pemberian Imbalan Bunga", href: "/payments/imbalan-bunga", icon: Scale },
              { label: "Permohonan PPh DTP", href: "/payments/pph-dtp", icon: FileCheck2 },
            ],
          },
        ],
      };
    }

    // Screenshot 4: Layanan WP Sidebar
    if (pathname.startsWith("/layanan")) {
      return {
        groupTitle: "Layanan Wajib Pajak",
        sections: [
          {
            title: "Layanan Utama",
            items: [
              { label: "Katalog Layanan", href: "/layanan", icon: LayoutDashboard },
              { label: "Riwayat Edukasi", href: "/layanan/riwayat-edukasi", icon: BookOpen },
              { label: "Buat Permohonan Administrasi", href: "/layanan/buat-permohonan", icon: FileText },
              { label: "Permohonan Dalam Proses", href: "/layanan/dalam-proses", icon: Clock },
              { label: "Permohonan Telah Selesai", href: "/layanan/telah-selesai", icon: CheckCircle },
              { label: "Daftar Fasilitas Saya", href: "/layanan/fasilitas-saya", icon: Sparkles },
            ],
          },
          {
            title: "Informasi & Edukasi",
            items: [
              { label: "Permintaan Informasi Perpajakan", href: "/layanan/permintaan-informasi", icon: HelpCircle },
              { label: "Pengaduan, Saran, Dan Apresiasi", href: "/layanan/buat-pengaduan", icon: ShieldAlert },
              { label: "Jadwal Kegiatan Edukasi", href: "/layanan/jadwal-edukasi", icon: CalendarClock },
              { label: "Materi E-Learning", href: "/layanan/e-learning", icon: BookOpen },
              { label: "Permohonan Edukasi Sekolah", href: "/layanan/permohonan-edukasi", icon: FileCheck2 },
            ],
          },
        ],
      };
    }

    // Ledger Sidebar
    if (pathname.startsWith("/ledger")) {
      return {
        groupTitle: "Buku Besar Pajak",
        sections: [
          {
            title: "Buku Besar & Pembukuan",
            items: [
              { label: "Jurnal Transaksi", href: "/ledger", icon: BookOpen },
              { label: "Jurnal Pajak Sekolah", href: "/ledger#pajak", icon: FileText },
              { label: "Buku Kas Umum (BKU) BOS", href: "/ledger#bos", icon: CreditCard },
              { label: "Rekonsiliasi Fiskal", href: "/ledger#rekon", icon: Scale },
            ],
          },
        ],
      };
    }

    // Management Sidebar
    if (pathname.startsWith("/management")) {
      return {
        groupTitle: "Manajemen Sistem",
        sections: [
          {
            title: "Manajemen",
            items: [
              { label: "Pengguna & Hak Akses", href: "/management/users", icon: Users },
              { label: "Aturan & Tarif Pajak", href: "/management/tax-rules", icon: Scale },
              { label: "Master Vendor BOS", href: "/management/vendors", icon: Building2 },
              { label: "Audit Trail Forensik", href: "/management/audit-logs", icon: ShieldAlert },
            ],
          },
        ],
      };
    }

    // Screenshot 2: Portal Saya Sidebar
    return {
      groupTitle: "Portal Saya",
      sections: [
        {
          title: "Portal Saya",
          items: [
            { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { label: "Dokumen Saya", href: "/portal/documents", icon: FolderOpen },
            { label: "Notifikasi Saya", href: "/portal/notifications", icon: Clock },
            { label: "Kasus Berjalan Saya", href: "/portal/active-cases", icon: Clock },
            { label: "Profil Saya", href: "/portal/profile", icon: Building2 },
            { label: "Kode Otorisasi / Sertifikat Elektronik", href: "/portal/sertifikat-elektronik", icon: Sparkles },
            { label: "Pengukuhan PKP", href: "/portal/pengukuhan-pkp", icon: FileCheck2 },
          ],
        },
        {
          title: "Perubahan Data & Status",
          items: [
            { label: "Identitas Wajib Pajak", href: "/portal/perubahan-data/identitas", icon: FileText },
            { label: "Perubahan Alamat Utama", href: "/portal/perubahan-data/alamat", icon: Building2 },
            { label: "Penetapan WP Nonaktif", href: "/portal/status/nonaktif", icon: Ban },
            { label: "Penunjukan Kuasa Wajib Pajak", href: "/portal/status/penunjukan-kuasa", icon: Users },
          ],
        },
      ],
    };
  };

  const { groupTitle, sections } = getSubmenuConfig();

  return (
    <aside className="w-64 lg:w-72 shrink-0">
      <div className="space-y-4 sticky top-20">
        
        {/* Context-Aware Sidebar Navigation (Matching Reference Screenshot 1 & 2) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-3 shadow-xs">
          
          {/* Submenu Title */}
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 tracking-tight">
              {groupTitle}
            </h3>
          </div>

          <div className="mt-2 space-y-3">
            {sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {section.title && (
                  <p className="px-3 pt-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {section.title}
                  </p>
                )}

                {section.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item.href);

                  return (
                    <Link
                      key={iIdx}
                      href={item.href}
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-purple-50 dark:bg-purple-950/70 text-[#381750] dark:text-purple-300 shadow-2xs border-l-4 border-[#381750] dark:border-purple-400 font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {Icon && (
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#381750] dark:text-purple-400" : "text-slate-400 group-hover:text-slate-600"}`} />
                        )}
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

        </div>

        {/* User Identity / NPWP Box */}
        <div className="rounded-xl p-3.5 text-white shadow-md relative overflow-hidden bg-[#381750] dark:bg-[#250d36] border border-purple-900/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-sm ring-2 ring-amber-400 shrink-0 overflow-hidden flex items-center justify-center">
            <Image
              src="/images/logo-smk.png"
              alt="Logo SMK Bina Putra Jakarta"
              width={40}
              height={40}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="relative z-10 min-w-0 flex-1">
            <div className="font-mono font-black text-xs tracking-wider text-purple-200 truncate">
              {currentUser.taxId}
            </div>
            <div className="font-bold text-xs tracking-tight mt-0.5 truncate">
              {currentUser.name}
            </div>
            <div className="text-[10px] font-semibold text-purple-300 uppercase tracking-wide truncate">
              {currentUser.schoolName}
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};

export const ContextSidebar: React.FC = () => {
  return (
    <React.Suspense fallback={<aside className="w-64 lg:w-72 shrink-0 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl h-96" />}>
      <ContextSidebarContent />
    </React.Suspense>
  );
};
