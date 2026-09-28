"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, FileSpreadsheet, FileText, Printer, CheckCircle2, Download } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  rowCount?: number;
  currentFilterText?: string;
  defaultFormat?: "csv" | "excel" | "pdf";
  defaultFilename?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  rowCount = 10,
  currentFilterText = "Semua Data",
  defaultFormat = "excel",
  defaultFilename,
}) => {
  const { showToast } = useApp();
  const [selectedFormat, setSelectedFormat] = useState<"csv" | "excel" | "pdf" | "print">(defaultFormat);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onClose();
      showToast({
        type: "success",
        title: "Ekspor Berhasil",
        description: `Dokumen "${title}" (${rowCount} baris) berhasil diekspor dalam format ${selectedFormat.toUpperCase()}.`,
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">
            Ekspor Data — {title}
          </h3>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          
          {/* Metadata Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs space-y-1.5 border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex justify-between">
              <span className="text-slate-500">Estimasi Jumlah Baris:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{rowCount} Rekord</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Filter Aktif:</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">{currentFilterText}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Instansi:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">SMK BINA PUTRA JAKARTA</span>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Pilih Format Berkas:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedFormat("excel")}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedFormat === "excel"
                    ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <div className="text-left">
                  <div>Excel (.xlsx)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Spreadsheet Resmi</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat("pdf")}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedFormat === "pdf"
                    ? "border-red-500 bg-red-50/60 dark:bg-red-950/40 text-red-800 dark:text-red-300 ring-1 ring-red-500"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300"
                }`}
              >
                <FileText className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <div>PDF (.pdf)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Siap Cetak / Arsip</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat("csv")}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedFormat === "csv"
                    ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 ring-1 ring-indigo-500"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Download className="w-5 h-5 text-indigo-600" />
                <div className="text-left">
                  <div>CSV (.csv)</div>
                  <div className="text-[10px] text-slate-400 font-normal">Data Tabular Baku</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat("print")}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                  selectedFormat === "print"
                    ? "border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Printer className="w-5 h-5 text-amber-600" />
                <div className="text-left">
                  <div>Cetak Langsung</div>
                  <div className="text-[10px] text-slate-400 font-normal">Dialog Print Browser</div>
                </div>
              </button>
            </div>
          </div>

        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
          >
            {isExporting ? "Memproses..." : "Mulai Unduh / Ekspor"}
          </button>
        </div>

      </div>
    </div>
  );
};
