"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  FileText, 
  FileCheck2, 
  Files, 
  CreditCard, 
  BookOpen, 
  LayoutGrid, 
  Settings2, 
  ChevronDown, 
  ChevronRight 
} from "lucide-react";

interface MegamenuColumn {
  title: string;
  items: { label: string; href: string; badge?: string }[];
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  hasDropdown?: boolean;
  megaColumns?: MegamenuColumn[];
}

export const SecondaryNavbar: React.FC = () => {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems: NavItem[] = [
    {
      id: "portal",
      label: "Portal Saya",
      href: "/dashboard",
      icon: ShieldCheck,
      hasDropdown: true,
      // Screenshot 2: 3-column Megamenu
      megaColumns: [
        {
          title: "Portal Saya",
          items: [
            { label: "Dokumen Saya", href: "/portal/documents" },
            { label: "Notifikasi Saya", href: "/portal/notifications" },
            { label: "Kasus Saya", href: "/portal/cases" },
            { label: "Kasus Berjalan Saya", href: "/portal/active-cases" },
            { label: "Profil Saya", href: "/portal/profile" },
            { label: "Permintaan Kode Otorisasi/Sertifikat Elektronik", href: "/portal/sertifikat-elektronik" },
            { label: "Pengukuhan PKP", href: "/portal/pengukuhan-pkp" },
            { label: "Pendaftaran Objek Pajak PBB P5L", href: "/portal/pbb-p5l" },
            { label: "Penghapusan & Pencabutan", href: "/portal/penghapusan-pencabutan" },
          ],
        },
        {
          title: "Perubahan Data",
          items: [
            { label: "Identitas Wajib Pajak", href: "/portal/perubahan-data/identitas" },
            { label: "Perubahan Alamat Utama", href: "/portal/perubahan-data/alamat" },
            { label: "Perubahan Data Objek Pajak PBB P5L", href: "/portal/perubahan-data/pbb" },
            { label: "Perubahan Data Pemungut PPN PMSE Dengan Kepdirjen", href: "/portal/perubahan-data/pmse" },
          ],
        },
        {
          title: "Perubahan Status",
          items: [
            { label: "Penetapan Wajib Pajak Nonaktif", href: "/portal/status/nonaktif" },
            { label: "Pengaktifan Kembali Wajib Pajak Nonaktif", href: "/portal/status/pengaktifan" },
            { label: "Penetapan Pemungut Bea Meterai", href: "/portal/status/pemungut-meterai" },
            { label: "Pencabutan Pemungut Bea Meterai", href: "/portal/status/pencabutan-meterai" },
            { label: "Penunjukan Wakil/Kuasa", href: "/portal/status/penunjukan-kuasa" },
            { label: "Perubahan Data Wakil/Kuasa Wajib Pajak", href: "/portal/status/perubahan-kuasa" },
            { label: "Pencabutan Wakil/Kuasa", href: "/portal/status/pencabutan-kuasa" },
            { label: "Penunjukan Pemotong Atau Pemungut Pph/Ppn", href: "/portal/status/penunjukan-pemotong" },
            { label: "Pencabutan Pemotong Atau Pemungut Pph/Ppn", href: "/portal/status/pencabutan-pemotong" },
            { label: "Penunjukan Pemungut PPN PMSE", href: "/portal/status/penunjukan-pmse" },
          ],
        },
      ],
    },
    {
      id: "faktur",
      label: "e-Faktur",
      href: "/invoices/outgoing",
      icon: FileText,
      // Screenshot 1: Tab selected without megamenu or with quick submenu
    },
    {
      id: "bupot",
      label: "e-Bupot",
      href: "/bupot",
      icon: FileCheck2,
      hasDropdown: true,
      megaColumns: [
        {
          title: "Bukti Pemotongan Pajak",
          items: [
            { label: "Bukti Potong Saya", href: "/bupot" },
            { label: "BPPU - PPh Pasal 22 & Pasal 23", href: "/bupot?type=BPPU" },
            { label: "BPNR - Bukan Pegawai Non Residen", href: "/bupot?type=BPNR" },
            { label: "Penyetoran Sendiri", href: "/bupot?type=Penyetoran" },
            { label: "Pemotongan Secara Digunggung", href: "/bupot?type=Digunggung" },
            { label: "Dokumen Dipersamakan Bukti Pemotongan", href: "/bupot?type=Dipersamakan" },
            { label: "BP 21 - Bukti Pemotongan Selain Pegawai Tetap", href: "/bupot?type=BP21", badge: "Guru GTT" },
            { label: "BP 26 - Wajib Pajak Luar Negeri", href: "/bupot?type=BP26" },
            { label: "BP A1 - Bukti Pemotongan A1 Tahunan", href: "/bupot?type=A1" },
            { label: "BP A2 - Bukti Pemotongan A2 ASN/PNS", href: "/bupot?type=A2" },
          ],
        },
      ],
    },
    {
      id: "spt",
      label: "SPT",
      href: "/spt",
      icon: Files,
      hasDropdown: true,
      // Screenshot 3: Surat Pemberitahuan (SPT)
      megaColumns: [
        {
          title: "Surat Pemberitahuan (SPT)",
          items: [
            { label: "Surat Pemberitahuan (SPT)", href: "/spt" },
            { label: "Coretax Form", href: "/spt/coretax-form" },
            { label: "Pencatatan", href: "/spt/pencatatan" },
            { label: "Dasbor Kompensasi", href: "/spt/kompensasi" },
            { label: "Pengungkapan Ketidakbenaran SPT", href: "/spt/pengungkapan" },
          ],
        },
      ],
    },
    {
      id: "pembayaran",
      label: "Pembayaran",
      href: "/payments",
      icon: CreditCard,
      hasDropdown: true,
      // Screenshot 5: Pembayaran
      megaColumns: [
        {
          title: "Pembayaran",
          items: [
            { label: "Permohonan Pemindahbukuan", href: "/payments/pemindahbukuan" },
            { label: "Layanan Mandiri Kode Billing", href: "/payments/kode-billing" },
            { label: "Pembuatan Kode Billing Atas Tagihan Pajak", href: "/payments/billing-tagihan" },
            { label: "Daftar Kode Billing Belum Dibayar", href: "/payments/billing-unpaid" },
            { label: "Formulir Restitusi Pajak", href: "/payments/restitusi" },
            { label: "Permohonan Pemberian Imbalan Bunga", href: "/payments/imbalan-bunga" },
            { label: "Permohonan PPh DTP Atas Penghasilan PDAM", href: "/payments/pph-dtp" },
          ],
        },
      ],
    },
    {
      id: "buku-besar",
      label: "Buku Besar",
      href: "/ledger",
      icon: BookOpen,
    },
    {
      id: "layanan",
      label: "Layanan WP",
      href: "/layanan",
      icon: LayoutGrid,
      hasDropdown: true,
      // Screenshot 4: 5-column Megamenu
      megaColumns: [
        {
          title: "Layanan Wajib Pajak",
          items: [
            { label: "Riwayat Edukasi", href: "/layanan/riwayat-edukasi" },
          ],
        },
        {
          title: "Layanan Administrasi",
          items: [
            { label: "Buat Permohonan Layanan Administrasi", href: "/layanan/buat-permohonan" },
            { label: "Permohonan Belum Disampaikan", href: "/layanan/belum-disampaikan" },
            { label: "Permohonan Dalam Proses", href: "/layanan/dalam-proses" },
            { label: "Permohonan Telah Selesai", href: "/layanan/telah-selesai" },
            { label: "Daftar Fasilitas Saya", href: "/layanan/fasilitas-saya" },
          ],
        },
        {
          title: "Layanan Permintaan Informasi Perpajakan",
          items: [
            { label: "Daftar Permintaan Informasi Perpajakan", href: "/layanan/permintaan-informasi" },
          ],
        },
        {
          title: "Layanan Pengaduan, Saran, Dan Apresiasi",
          items: [
            { label: "Buat Pengaduan, Saran, Dan Apresiasi", href: "/layanan/buat-pengaduan" },
            { label: "Daftar Pengaduan, Saran, Dan Apresiasi", href: "/layanan/daftar-pengaduan" },
          ],
        },
        {
          title: "Layanan Edukasi Perpajakan",
          items: [
            { label: "Jadwal Kegiatan Edukasi", href: "/layanan/jadwal-edukasi" },
            { label: "Materi Edukasi Umum", href: "/layanan/edukasi-umum" },
            { label: "Materi Edukasi Khusus", href: "/layanan/edukasi-khusus" },
            { label: "Materi E-Learning", href: "/layanan/e-learning" },
            { label: "Penyampaian Permohonan Edukasi", href: "/layanan/permohonan-edukasi" },
            { label: "Daftar Permohonan Edukasi", href: "/layanan/daftar-permohonan-edukasi" },
          ],
        },
      ],
    },
    {
      id: "manajemen",
      label: "Manajemen",
      href: "/management/users",
      icon: Settings2,
      hasDropdown: true,
      megaColumns: [
        {
          title: "Manajemen Sistem",
          items: [
            { label: "Pengguna & Hak Akses", href: "/management/users" },
            { label: "Aturan & Tarif Pajak", href: "/management/tax-rules" },
            { label: "Master Vendor BOS", href: "/management/vendors" },
            { label: "Audit Trail Forensik", href: "/management/audit-logs" },
          ],
        },
      ],
    },
  ];

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 250);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 shadow-2xs relative z-40">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Main Horizontal Navigation List */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 scrollbar-none" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = 
                item.id === "portal" 
                  ? (pathname === "/dashboard" || pathname.startsWith("/portal"))
                  : item.id === "faktur"
                  ? pathname.startsWith("/invoices")
                  : item.id === "manajemen"
                  ? pathname.startsWith("/management")
                  : pathname.startsWith(item.href.split("?")[0]);

              return (
                <div
                  key={item.id}
                  className="shrink-0"
                  onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (item.hasDropdown) {
                        setOpenDropdown(openDropdown === item.id ? null : item.id);
                      }
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-[13px] font-semibold transition-all ${
                      isActive
                        ? "bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 shadow-2xs ring-1 ring-amber-300 dark:ring-amber-800"
                        : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-700 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"}`} />
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === item.id ? "rotate-180 text-amber-700" : "text-slate-400"}`} />
                    )}
                  </Link>

                  {/* Comprehensive Megamenu Dropdown matching Screenshots 2, 3, 4, 5 */}
                  {item.hasDropdown && openDropdown === item.id && item.megaColumns && (
                    <div 
                      className={`absolute left-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-b-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 ${
                        item.megaColumns.length === 1 
                          ? "w-80 sm:w-96 p-4" 
                          : item.megaColumns.length === 3 
                          ? "w-full max-w-5xl p-6" 
                          : "w-full max-w-7xl p-6"
                      }`}
                      style={{
                        background: "linear-gradient(to bottom, #FFFDF9, #FFFFFF)",
                      }}
                    >
                      <div className={`grid gap-6 sm:gap-8 ${
                        item.megaColumns.length === 1 
                          ? "grid-cols-1" 
                          : item.megaColumns.length === 3 
                          ? "grid-cols-1 md:grid-cols-3" 
                          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                      }`}>
                        {item.megaColumns.map((col, cIdx) => (
                          <div key={cIdx} className="space-y-2">
                            {/* Column Header */}
                            <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100 dark:border-slate-800/80">
                              {col.title}
                            </h4>
                            
                            {/* Menu Links */}
                            <div className="space-y-1 pt-1">
                              {col.items.map((sub, sIdx) => (
                                <Link
                                  key={sIdx}
                                  href={sub.href}
                                  onClick={() => setOpenDropdown(null)}
                                  className="group flex items-center justify-between text-xs sm:text-[13px] font-medium text-[#381750] dark:text-purple-200 hover:text-amber-600 dark:hover:text-amber-400 py-1 transition-colors leading-relaxed"
                                >
                                  <span className="truncate group-hover:translate-x-0.5 transition-transform">
                                    {sub.label}
                                  </span>
                                  {sub.badge && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 shrink-0 ml-1">
                                      {sub.badge}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Overflow Navigation Chevron Button */}
          <div className="hidden lg:flex items-center pl-2 shrink-0">
            <button 
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
              title="Menu Lainnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
