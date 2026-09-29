export type UserRole = 
  | 'SUPER ADMIN'
  | 'KEPALA SEKOLAH'
  | 'BENDAHARA'
  | 'ADMIN PAJAK'
  | 'VERIFIKATOR'
  | 'OPERATOR'
  | 'AUDITOR'
  | 'MITRA';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  taxId: string; // NPWP / NIK
  schoolName: string;
  avatarUrl?: string;
  department: string;
  partnerCompany?: string;
  partnerCategory?: string;
  partnerPhone?: string;
}

export type TaxType = 'PPN' | 'PPH21' | 'PPH22' | 'PPH23' | 'PPH4_2';

export interface TaxRule {
  id: string;
  code: string;
  taxType: TaxType;
  name: string;
  ratePercentage: number;
  effectiveFrom: string;
  effectiveTo?: string;
  description: string;
  isGovernmentStandard: boolean;
  version: string;
}

export type TransactionStatus = 
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REVISION_REQUIRED'
  | 'PAID'
  | 'REJECTED'
  | 'CANCELLED';

export interface Transaction {
  id: string;
  trxNumber: string;
  date: string;
  type: 'PENGADAAN_BOS' | 'HONOR_GURU' | 'SEWA_GEDUNG' | 'JASA_LAB' | 'OPERASIONAL';
  categoryName: string;
  vendorName: string;
  vendorNpwp: string;
  description: string;
  grossAmount: number;
  taxType: TaxType;
  taxBase: number; // DPP
  taxRate: number; // e.g. 11, 5, 2, 1.5, 10
  taxAmount: number;
  netAmount: number;
  status: TransactionStatus;
  createdBy: string;
  attachmentsCount: number;
}

export type InvoiceStatus = 'DRAFT' | 'TERBIT' | 'RETUR' | 'DIBATALKAN';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  taxInvoiceNumber: string; // NSFP
  type: 'KELUARAN' | 'MASUKAN';
  date: string;
  counterpartyName: string;
  counterpartyNpwp: string;
  dpp: number;
  ppnRate: number;
  ppnAmount: number;
  total: number;
  status: InvoiceStatus;
  createdBy: string;
  period: string; // e.g. "09-2026"
}

export type BupotType = 'BP21' | 'BPPU' | 'BPNR' | 'BP4_2' | 'BP_A1' | 'BP_A2';
export type BupotStatus = 'DRAFT' | 'TERBIT' | 'DIBATALKAN';

export interface WithholdingSlip {
  id: string;
  bupotNumber: string;
  bupotType: BupotType;
  taxType: TaxType;
  taxObjectCode: string;
  objectDescription: string;
  beneficiaryName: string;
  beneficiaryNpwpNik: string;
  grossAmount: number;
  effectiveRate: number;
  taxWithheld: number;
  periodMonth: number;
  periodYear: number;
  status: BupotStatus;
  dateCreated: string;
  createdBy: string;
}

export type SptStatus = 
  | 'KONSEP'
  | 'MENUNGGU_VERIFIKASI'
  | 'MENUNGGU_PEMBAYARAN'
  | 'SIAP_PROSES'
  | 'DILAPORKAN'
  | 'DITOLAK'
  | 'DIBATALKAN';

export interface SptRecord {
  id: string;
  taxType: string; // e.g. "SPT Masa Unifikasi", "SPT Masa PPN 1107 PUT", "SPT Masa PPh 21/26"
  sptCategory: 'MASA' | 'TAHUNAN' | 'PEMBETULAN';
  taxPeriod: string; // e.g. "September 2026"
  periodMonth: number;
  periodYear: number;
  totalDpp: number;
  totalTax: number;
  status: SptStatus;
  createdDate: string;
  createdBy: string;
  billingCode?: string;
  ntpn?: string;
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'LATE' | 'VERIFIED' | 'CANCELLED';

export interface PaymentRecord {
  id: string;
  billingCode: string;
  taxType: string;
  period: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  paymentDate?: string;
  paymentChannel?: string;
  ntpn?: string;
  referenceNote: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  refNumber: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  taxRef: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'LOGIN' | 'EXPORT' | 'PAYMENT';
  module: string;
  recordIdentifier: string;
  details: string;
  ipAddress: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  category: 'APPROVAL' | 'DEADLINE' | 'TAX' | 'INFO';
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: string;
  npwp: string;
  category: string;
  bankAccount: string;
  city: string;
  status: string;
  phone?: string;
  address?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  branch: string;
  accountName: string;
  accountNumber: string;
  type: string;
  status: string;
  isPrimary: boolean;
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  nss: string;
  taxId: string;
  npwp?: string;
  npwp16?: string;
  accreditation?: string;
  educationLevel: string;
  ownershipStatus: string;
  kppPratama: string;
  wapuStatus: string;
  principalName: string;
  treasurerName: string;
  taxAdminName: string;
  phone: string;
  email: string;
  address: string;
}

export type ServiceRequestType = 
  | 'ADMINISTRASI' 
  | 'PENGADUAN' 
  | 'EDUKASI' 
  | 'SERTIFIKAT_ELEKTRONIK' 
  | 'PENGUKUHAN_PKP' 
  | 'PERUBAHAN_DATA' 
  | 'PERUBAHAN_STATUS' 
  | 'RESTITUSI' 
  | 'PEMINDAHBUKUAN' 
  | 'PBB_P5L'
  | 'INFORMASI_PERPAJAKAN'
  | 'FASILITAS';

export type ServiceRequestStatus = 'MENUNGGU' | 'DALAM_PROSES' | 'DISETUJUI' | 'DITOLAK' | 'SELESAI';

export interface ServiceRequest {
  id: string;
  ticketNumber: string;
  type: ServiceRequestType;
  title: string;
  category: string;
  applicantName: string;
  npwp: string;
  dateSubmitted: string;
  status: ServiceRequestStatus;
  progressPercent: number;
  currentStep: string;
  notes?: string;
  responseDoc?: string;
  bpeNumber?: string;
  details?: Record<string, any>;
}

export interface InvoiceReturn {
  id: string;
  returnNumber: string;
  originalInvoiceNumber: string;
  type: 'RETUR_KELUARAN' | 'RETUR_MASUKAN' | 'RETUR_DOKUMEN_KELUARAN' | 'RETUR_DOKUMEN_MASUKAN';
  date: string;
  counterpartyName: string;
  counterpartyNpwp: string;
  dppReturned: number;
  ppnReturned: number;
  ppnbmReturned?: number;
  status: 'TERVERIFIKASI' | 'MENUNGGU_APPROVAL' | 'BATAL';
  reason: string;
}

export interface OtherTaxDocument {
  id: string;
  documentNumber: string;
  type: 'DOKUMEN_KELUARAN' | 'DOKUMEN_MASUKAN';
  documentType: string;
  date: string;
  counterpartyName: string;
  counterpartyNpwp: string;
  dpp: number;
  ppn: number;
  status: 'TERVERIFIKASI' | 'DRAFT';
  description?: string;
}

export interface CompensationRecord {
  id: string;
  periodOrigin: string;
  periodDestination: string;
  sptType: string;
  amount: number;
  status: 'TERSEDIA' | 'DIKOMPENSASI' | 'MENUNGGU_VALIDASI';
  decisionLetterNumber?: string;
}

export interface GrossRevenueRecord {
  id: string;
  month: number;
  year: number;
  grossRevenue: number;
  finalTaxRate: number; // e.g. 0.5% PP 55/2022
  finalTaxDue: number;
  billingCode?: string;
  isPaid: boolean;
  notes?: string;
}

