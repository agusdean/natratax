"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { 
  LayoutGrid, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  Download,
  Printer,
  Search,
  Calendar,
  Send,
  UserCheck,
  AlertCircle,
  X
} from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  status: string;
  badgeColor: string;
}

export default function LayananPage() {
  const { showToast, schoolProfile } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // State for NIK Validation tool
  const [nikInput, setNikInput] = useState("");
  const [nikResult, setNikResult] = useState<{ status: "idle" | "success" | "invalid"; message: string } | null>(null);

  // State for Konsultasi form
  const [consultationForm, setConsultationForm] = useState({
    topic: "Belanja Modal Sarpras BOS Tahap 1",
    date: "2026-10-05",
    pic: "Bpk. Bambang Sutopo (Bendahara)",
    phone: "0812-9876-5432",
    notes: ""
  });

  const services: ServiceItem[] = [
    {
      id: "skf",
      title: "Surat Keterangan Fiskal (SKF) Sekolah",
      desc: "Pengajuan dan cetak SKF internal untuk syarat akreditasi SMK, hibah pendidikan, dan pengadaan instansi pemerintah.",
      status: "TERVERIFIKASI AKTIF",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    },
    {
      id: "skb",
      title: "Surat Keterangan Bebas (SKB) PPh Yayasan",
      desc: "Pengelolaan fasilitas pembebasan pemotongan PPh Pasal 22/23 atas sisa lebih yayasan pendidikan yang direinvestasikan.",
      status: "BERLAKU S.D 2027",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    },
    {
      id: "npwp16",
      title: "Validasi NIK menjadi NPWP 16 Digit",
      desc: "Pengecekan dan pemadanan massal NIK guru dan tenaga kependidikan untuk kesiapan integrasi data Coretax DJP.",
      status: "38 GURU VALID",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    },
    {
      id: "konsul",
      title: "Konsultasi Kepatuhan Pajak BOS",
      desc: "Layanan asistensi pendampingan langsung bersama Tim Ahli Pajak Satuan Pengawas Yayasan Bina Putra.",
      status: "TERSEDIA",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    }
  ];

  const handleValidateNik = (e: React.FormEvent) => {
    e.preventDefault();
    if (nikInput.length !== 16 || !/^\d+$/.test(nikInput)) {
      setNikResult({
        status: "invalid",
        message: "Format NIK harus tepat 16 digit angka."
      });
      return;
    }

    setNikResult({
      status: "success",
      message: `NIK ${nikInput} Berhasil Terpadankan dengan Basis Data DJP & Dukcapil. Status NPWP 16 Valid & Aktif.`
    });
  };

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: "success",
      title: "Jadwal Konsultasi Disimpan",
      description: `Permohonan konsultasi "${consultationForm.topic}" pada ${consultationForm.date} telah terdaftar. Ref: KONSUL-${Date.now().toString().slice(-5)}`
    });
    setActiveModal(null);
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "Beranda", href: "/dashboard" },
        { label: "Layanan Wajib Pajak" }
      ]}
    >
      <div className="space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Layanan Wajib Pajak & Kepatuhan Fiskal Sekolah
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Layanan internal pendukung kepatuhan pajak, surat keterangan, dan verifikasi NIK guru SMK BINA PUTRA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Status Fiskal: Patuh (Clear & Clean)
            </span>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((svc) => (
            <div key={svc.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{svc.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${svc.badgeColor}`}>
                    {svc.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {svc.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveModal(svc.id)}
                  className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Buka Layanan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL 1: SKF SEKOLAH */}
        {activeModal === "skf" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Surat Keterangan Fiskal (SKF)</h3>
                    <p className="text-[11px] text-slate-500">Ketetapan Pemenuhan Kewajiban Perpajakan Wajib Pajak</p>
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Status Kepatuhan: MEMENUHI KETENTUAN (AKTIF)
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Wajib Pajak telah menyampaikan SPT Tahunan 2 tahun pajak terakhir dan tidak memiliki tunggakan pajak.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Nomor SKF</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">SKF-00492/WPJ.06/KP.0403/2026</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Masa Berlaku</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">s/d 31 Desember 2026</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Nama Instansi</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{schoolProfile?.name || "SMK BINA PUTRA JAKARTA"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">NPWP 16 Digit</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{schoolProfile?.npwp16 || "0012345678901000"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      showToast({ type: "success", title: "Mencetak SKF", description: "Mengirim berkas SKF resmi ke antrean printer." });
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Cetak Dokumen
                  </button>
                  <button
                    onClick={() => {
                      showToast({ type: "success", title: "Unduh SKF", description: "Dokumen elektronik SKF.pdf berhasil diunduh." });
                      setActiveModal(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh Salinan PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: SKB PPh YAYASAN */}
        {activeModal === "skb" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Fasilitas SKB PPh Yayasan Pendidikan</h3>
                    <p className="text-[11px] text-slate-500">Pembebasan Pemotongan Pajak Reinvestasi Sarpras Sekolah</p>
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs">
                  <div className="font-bold text-blue-900 dark:text-blue-300 text-sm mb-1">
                    Dasar Ketetapan: PMK-68/PMK.03/2020 & Per-Dirjen Pajak
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Sisa lebih yang diterima yayasan/badan pendidikan nirlaba yang ditanamkan kembali dalam bentuk sarana dan prasarana dalam jangka waktu paling lama 4 (empat) tahun dikecualikan dari objek PPh.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium">Nomor Surat Keputusan (SKB):</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">KET-SKB-0082/WPJ.06/2023</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium">Status Penggunaan:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      AKTIF BERLAKU
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium">Tenggat Waktu Reinvestasi:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">31 Desember 2027 (Tahun ke-3)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500 font-medium">Total Dana Direinvestasikan:</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">Rp 450.000.000</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      showToast({ type: "info", title: "Unduh SKB", description: "Salinan SK Bebas PPh Yayasan diunduh." });
                      setActiveModal(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh Berkas SKB
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: VALIDASI NIK 16 DIGIT */}
        {activeModal === "npwp16" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Uji Pemadanan NIK - NPWP 16 Digit</h3>
                    <p className="text-[11px] text-slate-500">Cek validasi identitas fiskal pendidik & tenaga kependidikan</p>
                  </div>
                </div>
                <button onClick={() => { setActiveModal(null); setNikResult(null); setNikInput(""); }} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleValidateNik} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Masukkan Nomor Induk Kependudukan (16 Digit NIK)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={16}
                      required
                      placeholder="Contoh: 3175081203850001"
                      value={nikInput}
                      onChange={(e) => setNikInput(e.target.value)}
                      className="flex-1 text-xs font-mono px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Uji Padan
                    </button>
                  </div>
                </div>

                {nikResult && (
                  <div className={`p-4 rounded-xl border text-xs ${
                    nikResult.status === "success" 
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300"
                  }`}>
                    <div className="flex items-center gap-2 font-bold mb-1">
                      {nikResult.status === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                      {nikResult.status === "success" ? "Data Terpadan & Valid" : "Validasi Gagal"}
                    </div>
                    <p className="text-[11px] leading-relaxed">{nikResult.message}</p>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Rekap Kesiapan NIK Guru SMK Bina Putra:</span>
                  Total Guru/Staf: 40 Orang | Terpadan DJP: 38 (95%) | Belum Padan: 2
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: KONSULTASI KEPATUHAN PAJAK BOS */}
        {activeModal === "konsul" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Reservasi Konsultasi Pajak BOS</h3>
                    <p className="text-[11px] text-slate-500">Bimbingan teknis kepatuhan belanja dana BOS & Hibah</p>
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBookConsultation} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Topik / Pokok Bahasan Konsultasi
                  </label>
                  <input
                    type="text"
                    required
                    value={consultationForm.topic}
                    onChange={(e) => setConsultationForm({ ...consultationForm, topic: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Usulan Tanggal Konsultasi
                    </label>
                    <input
                      type="date"
                      required
                      value={consultationForm.date}
                      onChange={(e) => setConsultationForm({ ...consultationForm, date: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      PIC / Pemohon
                    </label>
                    <input
                      type="text"
                      required
                      value={consultationForm.pic}
                      onChange={(e) => setConsultationForm({ ...consultationForm, pic: e.target.value })}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Catatan Kasus Perpajakan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Konsultasi mengenai pemotongan PPh 22 atas rekanan non-PKP sarana multimedia..."
                    value={consultationForm.notes}
                    onChange={(e) => setConsultationForm({ ...consultationForm, notes: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Kirim Permohonan
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
