"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Plus, 
  Users, 
  Award, 
  Send, 
  ChevronRight, 
  FileCheck2,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";

export default function PracticumPage() {
  const { 
    currentUser, 
    orgContext, 
    toggleOperatingMode, 
    practicumBatches, 
    practicumAssignments, 
    practicumSubmissions, 
    addPracticumAssignment, 
    submitPracticum, 
    gradePracticumSubmission,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"assignments" | "submissions" | "workflow" | "batches">("assignments");
  
  // Assignment Modal
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDueDate, setNewDueDate] = useState("2026-10-31");
  const [newMaxScore, setNewMaxScore] = useState(100);
  const [newInstructions, setNewInstructions] = useState("");

  // Grading Modal
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeFeedback, setGradeFeedback] = useState<string>("");

  // Student Submission state
  const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] = useState<string | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState("");

  const activeBatch = practicumBatches[0];
  const isInstructor = currentUser.role === "INSTRUCTOR" || currentUser.role === "SUPER ADMIN" || currentUser.role === "KEPALA SEKOLAH";

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast({ type: "error", title: "Form Belum Lengkap", description: "Judul tugas praktikum wajib diisi." });
      return;
    }
    addPracticumAssignment({
      batchId: activeBatch?.id || "batch-akl-2026",
      title: newTitle,
      description: newDesc,
      dueDate: newDueDate,
      maxScore: Number(newMaxScore),
      instructions: newInstructions,
      status: "OPEN",
    });
    setIsAddAssignmentOpen(false);
    setNewTitle("");
    setNewDesc("");
    setNewInstructions("");
  };

  const handleGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmissionId) return;
    gradePracticumSubmission(gradingSubmissionId, Number(gradeScore), gradeFeedback);
    setGradingSubmissionId(null);
    setGradeFeedback("");
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentForSubmit) return;
    submitPracticum(selectedAssignmentForSubmit, submissionNotes, 2);
    setSelectedAssignmentForSubmit(null);
    setSubmissionNotes("");
  };

  return (
    <AppShell breadcrumbs={[{ label: "Beranda", href: "/dashboard" }, { label: "Instruktur & Praktikum", href: "/practicum" }, { label: "Laboratorium Pajak Siswa" }]}>
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="w-6 h-6" />
                </span>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Modul Praktikum & Laboratorium Pajak Vokasi
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sistem simulasi perpajakan sekolah terintegrasi dengan pemisahan sandbox operasional.
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Mode Indicator & Switcher */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status Sandbox</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {orgContext.operatingMode === "PRACTICUM_SANDBOX" ? "Data Terisolasi (Latihan)" : "Operasional Nyata Sekolah"}
                </div>
              </div>
              <button
                onClick={toggleOperatingMode}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wide transition-all shadow-xs ${
                  orgContext.operatingMode === "PRACTICUM_SANDBOX"
                    ? "bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-300"
                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                }`}
              >
                {orgContext.operatingMode === "PRACTICUM_SANDBOX" ? "PRACTICUM MODE (AKTIF)" : "AKTIFKAN SANDBOX"}
              </button>
            </div>
          </div>

          {/* Active Batch Summary Card */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Kelas Aktif</span>
              <div className="font-extrabold text-sm text-slate-800 dark:text-slate-100 mt-0.5 truncate">{activeBatch?.name}</div>
              <span className="text-[10px] text-slate-400 font-medium">Instruktur: {activeBatch?.instructorName}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Peserta Terdaftar</span>
              <div className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400 mt-0.5">
                {activeBatch?.participantsCount} / {activeBatch?.participantLimit} <span className="text-xs font-normal text-slate-500">Siswa</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">100% Terverifikasi</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Tugas Diterbitkan</span>
              <div className="font-extrabold text-lg text-slate-800 dark:text-slate-100 mt-0.5">
                {practicumAssignments.length} <span className="text-xs font-normal text-slate-500">Modul</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Kurikulum Merdeka SMK</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Jawaban Masuk</span>
              <div className="font-extrabold text-lg text-amber-600 dark:text-amber-400 mt-0.5">
                {practicumSubmissions.length} <span className="text-xs font-normal text-slate-500">Jawaban</span>
              </div>
              <span className="text-[10px] text-indigo-600 font-bold">Rata-rata Nilai: 95.0</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("assignments")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === "assignments"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Daftar Tugas Praktikum ({practicumAssignments.length})
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === "submissions"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Pengumpulan & Penilaian ({practicumSubmissions.length})
          </button>
          <button
            onClick={() => setActiveTab("workflow")}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === "workflow"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Simulasi Alur 5-Lapisan
          </button>
        </div>

        {/* TAB 1: ASSIGNMENTS */}
        {activeTab === "assignments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Modul Tugas Praktikum Pajak</h3>
                <p className="text-xs text-slate-500">Materi latihan studi kasus penatausahaan keuangan dan pajak sekolah</p>
              </div>
              {isInstructor && (
                <button
                  onClick={() => setIsAddAssignmentOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tugas Baru</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {practicumAssignments.map((asg) => (
                <div key={asg.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        Bobot {asg.maxScore} Poin
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Batas: {asg.dueDate}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{asg.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{asg.description}</p>
                    
                    <div className="mt-4 p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                      <strong className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Petunjuk Pengerjaan:</strong>
                      {asg.instructions}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      Status: Terbuka
                    </span>
                    <button
                      onClick={() => setSelectedAssignmentForSubmit(asg.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      <span>Kirim Jawaban</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SUBMISSIONS */}
        {activeTab === "submissions" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Daftar Pengumpulan Tugas Siswa</h3>
                <p className="text-xs text-slate-500">Evaluasi dan berikan nilai atas simulasi transaksi perpajakan siswa</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Nama Siswa / Peserta</th>
                    <th className="px-5 py-3">Tugas Praktikum</th>
                    <th className="px-5 py-3">Tanggal Kirim</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Nilai</th>
                    <th className="px-5 py-3">Catatan / Feedback</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {practicumSubmissions.map((sub) => {
                    const asg = practicumAssignments.find((a) => a.id === sub.assignmentId);
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                          {sub.studentName}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                          {asg?.title || sub.assignmentId}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">{sub.submissionDate}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            sub.status === "GRADED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}>
                            {sub.status === "GRADED" ? "Dinilai" : "Menunggu Review"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-black text-sm text-indigo-600 dark:text-indigo-400">
                          {sub.score !== undefined ? `${sub.score} / 100` : "-"}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">
                          {sub.feedback || sub.notes || "-"}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {isInstructor && (
                            <button
                              onClick={() => {
                                setGradingSubmissionId(sub.id);
                                setGradeScore(sub.score || 95);
                                setGradeFeedback(sub.feedback || "");
                              }}
                              className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-bold text-[11px] transition-colors"
                            >
                              {sub.status === "GRADED" ? "Koreksi Nilai" : "Beri Nilai"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: WORKFLOW SIMULATOR */}
        {activeTab === "workflow" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Alur Operasional Master (PrakTax-Inspired Single Data Lineage)</h3>
              <p className="text-xs text-slate-500 mt-1">Diagram alir transaksi yang dipelajari siswa dalam satu database terpadu tanpa redundansi data.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { step: "1", title: "Transaksi Harian", desc: "Input pengadaan BOS / honor GTT dengan kode objek pajak resmi." },
                { step: "2", title: "Tax Rule Engine", desc: "Penghitungan server-side otomatis tanpa hardcode tarif di UI." },
                { step: "3", title: "Faktur & Bupot", desc: "Penerbitan otomatis dokumen pajak terkunci berstatus TERBIT." },
                { step: "4", title: "Posting SPT Masa", desc: "Agregasi otomatis dari dokumen sumber tanpa input manual ulang." },
                { step: "5", title: "Kas Negara & NTPN", desc: "Penyetoran billing ke kas negara dan update Buku Kas Umum." },
              ].map((item) => (
                <div key={item.step} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-between">
                  <div>
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center mb-2">
                      {item.step}
                    </span>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tervalidasi Sistem</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal: Tambah Tugas Baru */}
      {isAddAssignmentOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Terbitkan Tugas Praktikum Pajak Baru</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Judul Tugas Praktikum</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Praktikum 4: Pemotongan PPh 23 Pemeliharaan Laboratorium"
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Deskripsi Singkat Kasus</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Deskripsikan kasus transaksi sekolah yang harus diselesaikan siswa..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Batas Waktu (Due Date)</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bobot Nilai Maksimal</label>
                  <input
                    type="number"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Instruksi Langkah Pengerjaan</label>
                <textarea
                  rows={3}
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="Instruksikan modul mana saja yang harus diisi: Transaksi -> Faktur/Bupot -> SPT -> Billing"
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAssignmentOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Penilaian Jawaban Siswa */}
      {gradingSubmissionId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Form Penilaian Tugas Praktikum</h3>
            <form onSubmit={handleGrade} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nilai Akhir (0 - 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 font-extrabold text-indigo-600 text-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Catatan Evaluasi / Feedback Instruktur</label>
                <textarea
                  rows={4}
                  required
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Contoh: Perhitungan DPP dan tarif PPh 21 sangat rapi. Faktur sudah cocok dengan SPT."
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmissionId(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Simpan Nilai & Kirim Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Siswa Kirim Jawaban */}
      {selectedAssignmentForSubmit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Kirim Jawaban Praktikum Siswa</h3>
            <form onSubmit={handleStudentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Catatan Pengerjaan Kasus</label>
                <textarea
                  rows={4}
                  required
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Tuliskan nomor referensi transaksi atau bukti potong yang telah Anda buat di mode sandbox..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800"
                />
              </div>
              <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>Pastikan Anda telah memasukkan data transaksi di mode sandbox sebelum mengirimkan jawaban.</span>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentForSubmit(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim ke Instruktur</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AppShell>
  );
}
