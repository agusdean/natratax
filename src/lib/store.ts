import { 
  User, 
  Transaction, 
  Invoice, 
  WithholdingSlip, 
  SptRecord, 
  PaymentRecord, 
  JournalEntry, 
  AuditLog, 
  SystemNotification,
  Vendor,
  BankAccount,
  ServiceRequest,
  InvoiceReturn,
  OtherTaxDocument,
  CompensationRecord,
  GrossRevenueRecord
} from "@/types";

/**
 * Akun Pengguna Administrator Tunggal (Clean State)
 * Memiliki hak akses penuh (SUPER ADMIN) untuk penatausahaan seluruh modul
 */
export const DEMO_USERS: User[] = [
  {
    id: "usr-admin",
    name: "ADMINISTRATOR UTAMA",
    email: "admin@binaputra.sch.id",
    role: "SUPER ADMIN",
    taxId: "998866000010609",
    schoolName: "SMK BINA PUTRA JAKARTA",
    department: "Penatausahaan Keuangan & Administrasi Pajak",
  }
];

// Seluruh data transaksi & operasional awal dikosongkan secara bersih (Clean Production State)
export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_INVOICES: Invoice[] = [];
export const INITIAL_RETURNS: InvoiceReturn[] = [];
export const INITIAL_OTHER_DOCS: OtherTaxDocument[] = [];
export const INITIAL_BUPOT: WithholdingSlip[] = [];
export const INITIAL_SPT: SptRecord[] = [];
export const INITIAL_PAYMENTS: PaymentRecord[] = [];
export const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [];
export const INITIAL_COMPENSATIONS: CompensationRecord[] = [];
export const INITIAL_GROSS_REVENUES: GrossRevenueRecord[] = [];
export const INITIAL_JOURNALS: JournalEntry[] = [];
export const INITIAL_NOTIFICATIONS: SystemNotification[] = [];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
export const INITIAL_VENDORS: Vendor[] = [];

// Rekening Operasional Resmi Satuan Pendidikan
export const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: "acc-1",
    bankName: "Bank DKI",
    branch: "KC Matraman Jakarta Timur",
    accountName: "SMK BINA PUTRA - KAS OPERASIONAL BOS",
    accountNumber: "102.20.00918",
    type: "Rekening Giro Khusus BOS (WAPU)",
    status: "AKTIF TERVALIDASI",
    isPrimary: true,
  }
];

// Profil Resmi Satuan Pendidikan SMK BINA PUTRA JAKARTA
export const INITIAL_SCHOOL_PROFILE = {
  name: "SMK BINA PUTRA JAKARTA",
  npsn: "20101234",
  nss: "322016001234",
  taxId: "998866000010609",
  npwp16: "0998866000010609",
  accreditation: "A",
  educationLevel: "Sekolah Menengah Kejuruan (SMK)",
  ownershipStatus: "Yayasan Pendidikan Swasta",
  kppPratama: "KPP Pratama Jakarta Matraman",
  wapuStatus: "Instansi Pemerintah / BOS Aktif",
  principalName: "DR. H. SURYADI, M.PD",
  treasurerName: "DUWI HERU SANTOSO, S.AK",
  taxAdminName: "SITI NURHALIZA, A.MD",
  phone: "021-8501234 / 8505678",
  email: "info@binaputra.sch.id / keuangan@binaputra.sch.id",
  address: "Jl. Balai Pustaka Baru No. 12, Matraman, Jakarta Timur 13120",
};

// Modul Instruktur & Praktikum Vokasi Perpajakan (Point 26-28)
export const INITIAL_PRACTICUM_BATCHES = [
  {
    id: "batch-akl-2026",
    name: "Kelas XII AKL 1 — Praktikum Perpajakan 2026/2027",
    instructorId: "usr-instructor-demo",
    instructorName: "Dra. Endang Purwanti, M.Ak",
    startDate: "2026-08-01",
    endDate: "2026-12-20",
    participantLimit: 36,
    status: "ACTIVE" as const,
    participantsCount: 32,
  },
];

export const INITIAL_PRACTICUM_ASSIGNMENTS = [
  {
    id: "asg-01",
    batchId: "batch-akl-2026",
    title: "Praktikum 1: Pemotongan PPh 21 Honor Guru GTT & Pemateri Workshop",
    description: "Hitung DPP 50% dan potong PPh 21 sebesar 5% atas honor narasumber tamu workshop vokasi.",
    dueDate: "2026-10-10",
    maxScore: 100,
    instructions: "Lakukan input transaksi honorarium guru tidak tetap, terbitkan Bukti Potong BP21, dan laporkan dalam SPT Masa PPh 21.",
    status: "OPEN" as const,
    createdAt: "2026-09-01",
  },
  {
    id: "asg-02",
    batchId: "batch-akl-2026",
    title: "Praktikum 2: Pengadaan Sarana Laptop Laboratorium BOS & Pemungutan PPh 22",
    description: "Verifikasi faktur pengadaan komputer lab di atas Rp 2.000.000 dengan tarif PPh 22 sebesar 1.5%.",
    dueDate: "2026-10-25",
    maxScore: 100,
    instructions: "Periksa bukti penerimaan barang, hitung DPP dan PPN 11%, pungut PPh 22 dan buat kode billing penyetoran.",
    status: "OPEN" as const,
    createdAt: "2026-09-05",
  },
  {
    id: "asg-03",
    batchId: "batch-akl-2026",
    title: "Praktikum 3: Rekonsiliasi SPT Masa PPN & Bukti Pembayaran NTPN",
    description: "Lakukan closing SPT Masa PPN, posting total pajak keluaran vs masukan, dan verifikasi NTPN setoran.",
    dueDate: "2026-11-15",
    maxScore: 100,
    instructions: "Lakukan rekonsiliasi data faktur masukan dan keluaran, finalisasi SPT, bayar billing, dan catat jurnal kas negara.",
    status: "OPEN" as const,
    createdAt: "2026-09-10",
  },
];

export const INITIAL_PRACTICUM_SUBMISSIONS = [
  {
    id: "sub-01",
    assignmentId: "asg-01",
    studentId: "usr-student-demo",
    studentName: "Dimas Aditya (XII AKL 1)",
    submissionDate: "2026-09-28",
    status: "GRADED" as const,
    score: 95,
    feedback: "Perhitungan DPP 50% dan potongan PPh 21 sangat akurat sesuai UU HPP dan PMK 168/2023.",
    notes: "Telah membuat transaksi TRX-BP-2026-09-001 dan Bupot BP21 honorarium Rp 4.500.000.",
    submittedRecordsCount: 2,
  },
];

export const INITIAL_ARCHIVED_DOCS = [
  {
    id: "arch-01",
    title: "SK Pengukuhan Bendahara WAPU Pajak SMK",
    category: "REPORT" as const,
    referenceNumber: "SK-YYS/2026/014",
    fileUrl: "/docs/sk-bendahara.pdf",
    fileSize: "1.2 MB",
    fileType: "application/pdf",
    version: 1,
    uploadedBy: "ADMINISTRATOR UTAMA",
    uploadedAt: "2026-09-01 08:30",
    isArchived: false,
  },
];

