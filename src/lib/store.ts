import { 
  User, 
  UserRole, 
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

export const DEMO_USERS: User[] = [
  {
    id: "usr-admin",
    name: "DUWI HERU SANTOSO",
    email: "duwi.heru@binaputra.sch.id",
    role: "BENDAHARA",
    taxId: "9988770000010609",
    schoolName: "SMK BINA PUTRA JAKARTA",
    department: "Pengelola Keuangan & Penatausahaan Perpajakan",
  },
  {
    id: "usr-superadmin",
    name: "AHMAD FADILLAH, S.Kom.",
    email: "ahmad.fadillah@binaputra.sch.id",
    role: "SUPER ADMIN",
    taxId: "9988770000010608",
    schoolName: "SMK BINA PUTRA JAKARTA",
    department: "Administrator Sistem TI & Infrastruktur",
  },
  {
    id: "usr-kepsek",
    name: "H. SURYADI, M.Pd.",
    email: "suryadi@binaputra.sch.id",
    role: "KEPALA SEKOLAH",
    taxId: "9988770000010610",
    schoolName: "SMK BINA PUTRA JAKARTA",
    department: "Penanggung Jawab Sekolah",
  },
  {
    id: "usr-adminpajak",
    name: "NURUL HIDAYATI, S.Ak.",
    email: "nurul.pajak@binaputra.sch.id",
    role: "ADMIN PAJAK",
    taxId: "9988770000010613",
    schoolName: "SMK BINA PUTRA JAKARTA",
    department: "Staf Penatausahaan Faktur & Bupot",
  },
  {
    id: "usr-verifikator",
    name: "BAMBANG SUDARMONO, S.E.",
    email: "bambang.verifikator@binaputra.sch.id",
    role: "VERIFIKATOR",
    taxId: "9988770000010614",
    schoolName: "SMK BINA PUTRA JAKARTA",
    department: "Verifikator SPJ & Kelayakan Pajak",
  },
  {
    id: "usr-operator",
    name: "DEWI LESTARI, S.E.",
    email: "dewi.lestari@binaputra.sch.id",
    role: "OPERATOR",
    taxId: "9988770000010611",
    schoolName: "SMK BINA PUTRA JAKARTA",
    department: "Operator Keuangan & BOS",
  },
  {
    id: "usr-auditor",
    name: "DRS. H. M. FAUZAN",
    email: "fauzan.audit@binaputra.sch.id",
    role: "AUDITOR",
    taxId: "9988770000010612",
    schoolName: "SMK BINA PUTRA JAKARTA",
    department: "Satuan Pengawas Internal (SPI)",
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "trx-001",
    trxNumber: "TRX/BOS/2026/09/001",
    date: "2026-09-18",
    type: "PENGADAAN_BOS",
    categoryName: "Pengadaan Perangkat Lab Komputer & Server Edukasi",
    vendorName: "PT Sentra Edu Informatika",
    vendorNpwp: "019928374015000",
    description: "Pengadaan 10 unit Komputer PC All-in-One Core i5 untuk Lab Praktikum Akuntansi",
    grossAmount: 45000000,
    taxType: "PPN",
    taxBase: 45000000,
    taxRate: 11,
    taxAmount: 4950000,
    netAmount: 40050000,
    status: "APPROVED",
    createdBy: "Duwi Heru Santoso",
    attachmentsCount: 2,
  },
  {
    id: "trx-002",
    trxNumber: "TRX/BOS/2026/09/002",
    date: "2026-09-22",
    type: "OPERASIONAL",
    categoryName: "Bahan & Modul Pelatihan Sertifikasi Pajak",
    vendorName: "CV Bina Sarana Mandiri",
    vendorNpwp: "031122334012000",
    description: "Pencetakan Buku Panduan Praktikum Coretax DJP & Modul Siswa SMK",
    grossAmount: 18500000,
    taxType: "PPH23",
    taxBase: 18500000,
    taxRate: 2,
    taxAmount: 370000,
    netAmount: 18130000,
    status: "APPROVED",
    createdBy: "Dewi Lestari",
    attachmentsCount: 1,
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-kel-01",
    invoiceNumber: "INV/BP/2026/09/001",
    taxInvoiceNumber: "010.002-26.11029381",
    type: "KELUARAN",
    date: "2026-09-20",
    counterpartyName: "PT Astra International Tbk (Mitra Industri PKL)",
    counterpartyNpwp: "013456789012000",
    dpp: 25000000,
    ppnRate: 11,
    ppnAmount: 2750000,
    total: 27750000,
    status: "TERBIT",
    period: "09-2026",
    createdBy: "Duwi Heru Santoso",
  },
  {
    id: "inv-kel-02",
    invoiceNumber: "INV/BP/2026/09/002",
    taxInvoiceNumber: "010.002-26.11029382",
    type: "KELUARAN",
    date: "2026-09-24",
    counterpartyName: "CV Cipta Karya Kreatif (Jasa Teaching Factory)",
    counterpartyNpwp: "024419812018000",
    dpp: 14000000,
    ppnRate: 11,
    ppnAmount: 1540000,
    total: 15540000,
    status: "TERBIT",
    period: "09-2026",
    createdBy: "Duwi Heru Santoso",
  },
  {
    id: "inv-mas-01",
    invoiceNumber: "INV-SEI-2026-091",
    taxInvoiceNumber: "010.002-26.78912340",
    type: "MASUKAN",
    date: "2026-09-18",
    counterpartyName: "PT Sentra Edu Informatika",
    counterpartyNpwp: "019928374015000",
    dpp: 45000000,
    ppnRate: 11,
    ppnAmount: 4950000,
    total: 49950000,
    status: "TERBIT",
    period: "09-2026",
    createdBy: "Dewi Lestari",
  },
  {
    id: "inv-mas-02",
    invoiceNumber: "INV-BSM-8821",
    taxInvoiceNumber: "010.002-26.78912341",
    type: "MASUKAN",
    date: "2026-09-22",
    counterpartyName: "CV Bina Sarana Mandiri",
    counterpartyNpwp: "031122334012000",
    dpp: 18500000,
    ppnRate: 11,
    ppnAmount: 2035000,
    total: 20535000,
    status: "TERBIT",
    period: "09-2026",
    createdBy: "Dewi Lestari",
  }
];

export const INITIAL_RETURNS: InvoiceReturn[] = [
  {
    id: "ret-kel-01",
    returnNumber: "NRK-2026/09/001",
    originalInvoiceNumber: "010.002-26.11029381",
    type: "RETUR_KELUARAN",
    date: "2026-09-25",
    counterpartyName: "PT Astra International Tbk",
    counterpartyNpwp: "013456789012000",
    dppReturned: 5000000,
    ppnReturned: 550000,
    status: "TERVERIFIKASI",
    reason: "Pengembalian 2 unit modul training akibat cacat cetak spesifikasi"
  },
  {
    id: "ret-mas-01",
    returnNumber: "NRM-2026/09/002",
    originalInvoiceNumber: "010.002-26.78912340",
    type: "RETUR_MASUKAN",
    date: "2026-09-26",
    counterpartyName: "PT Sentra Edu Informatika",
    counterpartyNpwp: "019928374015000",
    dppReturned: 4500000,
    ppnReturned: 495000,
    status: "TERVERIFIKASI",
    reason: "Penggantian 1 unit monitor yang mengalami kerusakan piksel saat unboxing"
  }
];

export const INITIAL_OTHER_DOCS: OtherTaxDocument[] = [
  {
    id: "oth-kel-01",
    documentNumber: "PEB-008912-2026",
    type: "DOKUMEN_KELUARAN",
    documentType: "Pemberitahuan Ekspor Barang (Teaching Factory)",
    date: "2026-09-12",
    counterpartyName: "EduGlobal Learning Singapore Ltd",
    counterpartyNpwp: "000000000000000",
    dpp: 32000000,
    ppn: 0,
    status: "TERVERIFIKASI",
    description: "Ekspor modul multimedia & simulator kejuruan SMK"
  },
  {
    id: "oth-mas-01",
    documentNumber: "SSP-PPNJLN-0926",
    type: "DOKUMEN_MASUKAN",
    documentType: "SSP PPN Pemanfaatan JKP Dari Luar Daerah Pabean",
    date: "2026-09-14",
    counterpartyName: "Zoom Video Communications Inc",
    counterpartyNpwp: "000000000000000",
    dpp: 7500000,
    ppn: 825000,
    status: "TERVERIFIKASI",
    description: "Langganan Enterprise LMS & Video Conference Sekolah"
  }
];

export const INITIAL_BUPOT: WithholdingSlip[] = [
  {
    id: "bp-001",
    bupotNumber: "BP21-2026-09-001",
    bupotType: "BP21",
    taxType: "PPH21",
    taxObjectCode: "21-100-01",
    objectDescription: "Penghasilan Guru / Pegawai Tetap",
    beneficiaryName: "DRS. BAMBANG WIJANARKO",
    beneficiaryNpwpNik: "081234567012000",
    grossAmount: 8500000,
    effectiveRate: 5,
    taxWithheld: 425000,
    periodMonth: 9,
    periodYear: 2026,
    status: "TERBIT",
    dateCreated: "2026-09-25",
    createdBy: "Duwi Heru Santoso",
  },
  {
    id: "bp-002",
    bupotNumber: "BPPU-2026-09-002",
    bupotType: "BPPU",
    taxType: "PPH23",
    taxObjectCode: "23-104-01",
    objectDescription: "Jasa Percetakan Modul Pembelajaran",
    beneficiaryName: "CV BINA SARANA MANDIRI",
    beneficiaryNpwpNik: "031122334012000",
    grossAmount: 18500000,
    effectiveRate: 2,
    taxWithheld: 370000,
    periodMonth: 9,
    periodYear: 2026,
    status: "TERBIT",
    dateCreated: "2026-09-22",
    createdBy: "Duwi Heru Santoso",
  }
];

export const INITIAL_SPT: SptRecord[] = [
  {
    id: "spt-001",
    taxType: "SPT Masa Unifikasi",
    sptCategory: "MASA",
    taxPeriod: "Agustus 2026",
    periodMonth: 8,
    periodYear: 2026,
    totalDpp: 63500000,
    totalTax: 1270000,
    status: "DILAPORKAN",
    createdDate: "2026-09-10",
    createdBy: "Duwi Heru Santoso",
    billingCode: "0239 8812 7721",
    ntpn: "9827BFA726354101",
  },
  {
    id: "spt-002",
    taxType: "SPT Masa PPN 1107 PUT",
    sptCategory: "MASA",
    taxPeriod: "September 2026",
    periodMonth: 9,
    periodYear: 2026,
    totalDpp: 45000000,
    totalTax: 4950000,
    status: "KONSEP",
    createdDate: "2026-09-28",
    createdBy: "Duwi Heru Santoso",
    billingCode: "0239 9988 1122",
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: "pay-001",
    billingCode: "0239 9988 1122",
    taxType: "PPN Instansi Pemerintah (411211 - 900)",
    period: "09-2026",
    amount: 4950000,
    dueDate: "2026-10-15",
    status: "PENDING",
    referenceNote: "Pajak Pengadaan Perangkat Komputer Lab Multimedia BOS",
  },
  {
    id: "pay-002",
    billingCode: "0239 8812 7721",
    taxType: "PPh Final Pasal 4 Ayat 2 (411128 - 402)",
    period: "08-2026",
    amount: 1270000,
    dueDate: "2026-09-15",
    status: "PAID",
    paymentDate: "2026-09-10 11:20:15",
    paymentChannel: "Bank DKI Virtual Account (Kas BOS)",
    ntpn: "9827BFA726354101",
    referenceNote: "Penyetoran PPh Sewa Ruang Serbaguna & Gedung Sekolah",
  }
];

export const INITIAL_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: "req-001",
    ticketNumber: "ADM-2026-09-0012",
    type: "ADMINISTRASI",
    title: "Permohonan Surat Keterangan Bebas (SKB) PPh Yayasan Pendidikan",
    category: "Fasilitas & Pembebasan Pajak",
    applicantName: "DUWI HERU SANTOSO",
    npwp: "9988770000010609",
    dateSubmitted: "2026-09-15",
    status: "DALAM_PROSES",
    progressPercent: 70,
    currentStep: "Penelitian Dokumen Laporan Realisasi Sisa Lebih",
    notes: "Seluruh berkas laporan penggunaan dana BOS dan saldo rekening yayasan telah diverifikasi oleh Account Representative.",
    bpeNumber: "BPE-KPP-20260915-0912",
  },
  {
    id: "req-002",
    ticketNumber: "CERT-2026-08-0045",
    type: "SERTIFIKAT_ELEKTRONIK",
    title: "Penerbitan Digital Certificate & Passphrase Coretax DJP",
    category: "Kode Otorisasi / Sertifikat Elektronik",
    applicantName: "H. SURYADI, M.Pd.",
    npwp: "9988770000010609",
    dateSubmitted: "2026-08-28",
    status: "SELESAI",
    progressPercent: 100,
    currentStep: "Sertifikat Elektronik Aktif (Berlaku s/d 2028-08-28)",
    notes: "Tanda Tangan Digital Tersertifikasi (BSrE) siap digunakan untuk penerbitan e-Faktur dan SPT.",
    bpeNumber: "BPE-CERT-20260828-0045",
  },
  {
    id: "req-003",
    ticketNumber: "CASE-2026-09-0088",
    type: "ADMINISTRASI",
    title: "Klarifikasi SP2DK Penyesuaian NIK Menjadi NPWP 16 Digit PTK",
    category: "Integrasi Basis Data Coretax",
    applicantName: "DEWI LESTARI",
    npwp: "9988770000010609",
    dateSubmitted: "2026-09-20",
    status: "DALAM_PROSES",
    progressPercent: 85,
    currentStep: "Sinkronisasi Identitas Guru dengan Dukcapil Pusat",
    notes: "Sebanyak 38 data NIK Guru & Karyawan SMK Bina Putra Jakarta telah valid dan terhubung.",
    bpeNumber: "BPE-SP2DK-20260920-0088",
  },
  {
    id: "req-004",
    ticketNumber: "PENG-2026-09-0003",
    type: "PENGADUAN",
    title: "Apresiasi atas Kemudahan Integrasi Modul Simulasi NatraTax",
    category: "Saran & Apresiasi Layanan",
    applicantName: "DUWI HERU SANTOSO",
    npwp: "9988770000010609",
    dateSubmitted: "2026-09-24",
    status: "SELESAI",
    progressPercent: 100,
    currentStep: "Ditanggapi Tim Helpdesk KPP Matraman",
    notes: "Terima kasih atas masukan positif terkait implementasi Coretax untuk kurikulum SMK.",
    bpeNumber: "BPE-APRES-20260924-0003",
  }
];

export const INITIAL_COMPENSATIONS: CompensationRecord[] = [
  {
    id: "cmp-01",
    periodOrigin: "Juli 2026",
    periodDestination: "September 2026",
    sptType: "SPT Masa PPN 1107 PUT",
    amount: 4500000,
    status: "TERSEDIA",
    decisionLetterNumber: "SKKPP-0921/WPJ.06/KP.03/2026"
  },
  {
    id: "cmp-02",
    periodOrigin: "Juni 2026",
    periodDestination: "Agustus 2026",
    sptType: "SPT Masa Unifikasi",
    amount: 1850000,
    status: "DIKOMPENSASI",
    decisionLetterNumber: "SKKPP-0814/WPJ.06/KP.03/2026"
  }
];

export const INITIAL_GROSS_REVENUES: GrossRevenueRecord[] = [
  {
    id: "rev-01",
    month: 7,
    year: 2026,
    grossRevenue: 42000000,
    finalTaxRate: 0.5,
    finalTaxDue: 210000,
    billingCode: "0239 7711 0021",
    isPaid: true,
    notes: "Peredaran Bruto Unit Produksi & Kantin Sekolah Juli 2026"
  },
  {
    id: "rev-02",
    month: 8,
    year: 2026,
    grossRevenue: 48500000,
    finalTaxRate: 0.5,
    finalTaxDue: 242500,
    billingCode: "0239 8822 1132",
    isPaid: true,
    notes: "Peredaran Bruto Unit Produksi & Sewa Lapangan Agustus 2026"
  },
  {
    id: "rev-03",
    month: 9,
    year: 2026,
    grossRevenue: 52000000,
    finalTaxRate: 0.5,
    finalTaxDue: 260000,
    billingCode: "0239 9933 2243",
    isPaid: false,
    notes: "Peredaran Bruto Teaching Factory & Jasa Pelatihan September 2026"
  }
];

export const INITIAL_JOURNALS: JournalEntry[] = [];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-init",
    title: "Sistem Siap Digunakan",
    message: "Selamat datang di NatraTax SMK BINA PUTRA JAKARTA. Sistem siap digunakan untuk pencatatan transaksi dan pelaporan pajak sekolah.",
    category: "INFO",
    timestamp: "Baru saja",
    isRead: false,
    link: "/dashboard",
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-init",
    timestamp: "2026-09-28 08:00:00",
    userName: "ADMINISTRATOR PERPAJAKAN & BENDAHARA",
    userRole: "BENDAHARA",
    action: "LOGIN",
    module: "AUTH",
    recordIdentifier: "USR-ADMIN",
    details: "Inisialisasi bersih sistem perpajakan SMK BINA PUTRA JAKARTA",
    ipAddress: "127.0.0.1",
  }
];

export const INITIAL_VENDORS: Vendor[] = [];

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
