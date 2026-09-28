"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Clock, 
  HelpCircle 
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  badge?: string;
}

export const AiAssistantDrawer: React.FC = () => {
  const { 
    isAiAssistantOpen, 
    setIsAiAssistantOpen, 
    transactions, 
    invoices, 
    sptList, 
    payments, 
    selectedPeriod 
  } = useApp();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "assistant",
      text: "Halo Bapak/Ibu Pengelola Pajak SMK BINA PUTRA JAKARTA! Saya NatraTax AI Assistant siap membantu menganalisis transaksi keuangan BOS, kesiapan SPT Masa Unifikasi, serta memeriksa kelengkapan bukti potong untuk periode " + selectedPeriod + ".",
      timestamp: "Baru saja",
      badge: "Saran Asistif",
    },
  ]);

  const quickPrompts = [
    "Analisis transaksi bulan September 2026",
    "Berikan daftar dokumen yang belum lengkap",
    "Tampilkan transaksi yang belum diverifikasi",
    "Ringkas kewajiban pembayaran pajak bulan ini",
    "Jelaskan aturan PPh 21 untuk honor guru GTT",
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    // Simulate assistive engine reasoning based on deterministic data in store
    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (lower.includes("analisis") || lower.includes("september")) {
        const totalGross = transactions.reduce((acc, t) => acc + t.grossAmount, 0);
        const totalTax = transactions.reduce((acc, t) => acc + t.taxAmount, 0);
        reply = `Berdasarkan data transaksi periode ${selectedPeriod}:\n• Total Volume Transaksi: ${formatRupiah(totalGross)} (${transactions.length} transaksi)\n• Total Estimasi Pajak Terutang/Dipotong: ${formatRupiah(totalTax)}\n• Transaksi Terbesar: Pengadaan Lab Komputer RPL via SIPLah BOS (${formatRupiah(75000000)} - PPN Rp 8.250.000).\nSeluruh pemotongan telah sesuai dengan aturan perpajakan instansi sekolah.`;
      } else if (lower.includes("belum lengkap") || lower.includes("dokumen")) {
        const drafts = transactions.filter((t) => t.status === "DRAFT");
        reply = `Terdapat ${drafts.length} transaksi yang dokumen kelengkapannya belum final:\n1. TRX-BP-2026-09-005 (Toko ATK Sumber Makmur) sebesar Rp 3.800.000 masih dalam status DRAFT dan belum mengunggah kuitansi bermeterai serta bukti terima barang BOS.`;
      } else if (lower.includes("verifikasi") || lower.includes("review")) {
        const pending = transactions.filter((t) => t.status === "UNDER_REVIEW");
        reply = `Ditemukan ${pending.length} transaksi yang sedang dalam antrean verifikasi:\n• ${pending.map(p => `${p.trxNumber} (${p.vendorName}) - ${formatRupiah(p.grossAmount)}`).join("\n")}\nCatatan: Transaksi ini memerlukan validasi SPI dan persetujuan Bendahara sebelum diterbitkan Bukti Potong.`;
      } else if (lower.includes("ringkas") || lower.includes("pembayaran")) {
        const pendingPay = payments.filter((p) => p.status === "PENDING");
        const totalPay = pendingPay.reduce((acc, p) => acc + p.amount, 0);
        reply = `Ringkasan Kewajiban Penyetoran Pajak (${selectedPeriod}):\n• Total Tagihan Pajak Belum Dibayar: ${formatRupiah(totalPay)}\n• Jumlah Kode Billing Aktif: ${pendingPay.length}\n• Jatuh Tempo: 10 Oktober 2026 untuk PPh Unifikasi dan PPh 21.\nHarap segera proses transfer melalui Rekening Kas Sekolah (Bank DKI).`;
      } else if (lower.includes("guru") || lower.includes("gtt") || lower.includes("pph 21")) {
        reply = `Sesuai Aturan Pajak Sekolah NatraTax (PPH21_HONOR_GURU):\n• Kategori: Bukan Pegawai yang menerima imbalan tidak berkesinambungan (Honor Asesor/GTT/Instruktur Workshop).\n• Dasar Pengenaan Pajak (DPP): 50% x Penghasilan Bruto.\n• Tarif Efektif: 5% dari DPP (setara 2.5% dari bruto bagi pemilik NPWP).\n• Jika tanpa NPWP: Dikenakan tarif 20% lebih tinggi (setara 3.0% efektif).`;
      } else {
        reply = `Saya memahami pertanyaan Anda terkait "${query}". Sebagai AI Asisten Administrasi Sekolah, saya memiliki akses baca-saja. Anda dapat mengecek menu e-Faktur, Konsep SPT, atau Pembayaran untuk rincian data transaksi resmi sekolah.`;
      }

      const botMsg: ChatMessage = {
        id: "bot-" + Date.now(),
        sender: "assistant",
        text: reply,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        badge: "Analisis Deterministik",
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
        title="Buka NatraTax AI Assistant"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white shadow-xl shadow-indigo-700/25 hover:scale-105 active:scale-95 transition-all border border-indigo-400/30"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
        <span className="font-bold text-xs tracking-wide">NatraTax AI</span>
      </button>

      {/* Slide-out Drawer */}
      {isAiAssistantOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-250">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-slate-900 dark:to-indigo-950/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                  NatraTax AI Assistant
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Read-Only
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Asisten Analisis Pajak & Finansial Sekolah
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAiAssistantOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Assistant Safety Notice */}
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/50 flex items-start gap-2 text-[10px] text-amber-800 dark:text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              <strong>Perhatian Kepatuhan:</strong> AI bersifat asistif. Perhitungan pajak resmi dihasilkan oleh Mesin Aturan Pajak dan wajib diverifikasi oleh Bendahara.
            </span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                {m.badge && (
                  <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 mb-1 ml-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {m.badge}
                  </span>
                )}
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs whitespace-pre-line leading-relaxed shadow-xs ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <p className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Pertanyaan Cepat Rekomendasi:
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp)}
                  className="text-[11px] text-left px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
            <input
              type="text"
              placeholder="Tanyakan analisis pajak atau status transaksi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
