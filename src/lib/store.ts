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
