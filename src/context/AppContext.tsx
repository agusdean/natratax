"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, 
  UserRole, 
  Permission,
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
  SchoolProfile,
  ServiceRequest,
  ServiceRequestStatus,
  InvoiceReturn,
  OtherTaxDocument,
  CompensationRecord,
  GrossRevenueRecord,
  OrganizationContext,
  ReconciliationItem,
  PracticumBatch,
  PracticumAssignment,
  PracticumSubmission,
  ArchivedDocument,
} from "@/types";
import { 
  DEMO_USERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_INVOICES, 
  INITIAL_BUPOT, 
  INITIAL_SPT, 
  INITIAL_PAYMENTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_VENDORS, 
  INITIAL_BANK_ACCOUNTS, 
  INITIAL_SCHOOL_PROFILE, 
  INITIAL_RETURNS, 
  INITIAL_OTHER_DOCS, 
  INITIAL_SERVICE_REQUESTS, 
  INITIAL_COMPENSATIONS, 
  INITIAL_GROSS_REVENUES,
  INITIAL_JOURNALS,
  INITIAL_PRACTICUM_BATCHES,
  INITIAL_PRACTICUM_ASSIGNMENTS,
  INITIAL_PRACTICUM_SUBMISSIONS,
  INITIAL_ARCHIVED_DOCS
} from "@/lib/store";
import { TaxCalculationService } from "@/lib/tax-engine";
import { hasPermission, ROLE_SAMPLE_USERS } from "@/lib/rbac";
import { INITIAL_ORG_CONTEXT, DEFAULT_UNITS } from "@/lib/org-context";

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
}

interface AppContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  availableUsers: User[];
  addUser: (user: Omit<User, "id">) => void;
  addMitra: (mitraData: {
    companyName: string;
    picName: string;
    npwp: string;
    category: string;
    email: string;
    phone: string;
    address?: string;
  }) => User;
  
  // Organization Context & Unit Switcher
  orgContext: OrganizationContext;
  switchUnit: (unitId: string) => void;
  toggleOperatingMode: () => void;
  setPeriod: (month: number, year: number) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;

  // RBAC Permission Check
  hasPermission: (permission: Permission) => boolean;

  // Compact Mode ("Padatkan" toggle) & Theme
  isCompactMode: boolean;
  setIsCompactMode: (compact: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // UI Drawers & Modals
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;

  // Data Collections (Single Source of Truth)
  transactions: Transaction[];
  invoices: Invoice[];
  bupotList: WithholdingSlip[];
  sptList: SptRecord[];
  payments: PaymentRecord[];
  journals: JournalEntry[];
  auditLogs: AuditLog[];
  notifications: SystemNotification[];
  vendors: Vendor[];
  bankAccounts: BankAccount[];
  schoolProfile: SchoolProfile;

  // Layanan WP & Portal Cases
  serviceRequests: ServiceRequest[];
  addServiceRequest: (req: Omit<ServiceRequest, "id" | "ticketNumber" | "dateSubmitted">) => ServiceRequest;
  updateServiceRequestStatus: (id: string, status: ServiceRequestStatus, currentStep?: string, notes?: string) => void;

  // e-Faktur Retur & Dokumen Lain
  invoiceReturns: InvoiceReturn[];
  addInvoiceReturn: (ret: Omit<InvoiceReturn, "id">) => void;
  otherTaxDocuments: OtherTaxDocument[];
  addOtherTaxDocument: (doc: Omit<OtherTaxDocument, "id">) => void;

  // Kompensasi & Pencatatan Omset
  compensations: CompensationRecord[];
  applyCompensation: (id: string) => void;
  grossRevenues: GrossRevenueRecord[];
  addGrossRevenue: (record: Omit<GrossRevenueRecord, "id">) => void;

  // Master Flow Operations
  addTransaction: (trx: Omit<Transaction, "id" | "trxNumber" | "createdBy">) => void;
  approveTransaction: (id: string) => void;
  addInvoice: (inv: Omit<Invoice, "id" | "createdBy">) => void;
  addBupot: (bupot: Omit<WithholdingSlip, "id" | "bupotNumber" | "createdBy" | "dateCreated">) => void;
  addSpt: (spt: Omit<SptRecord, "id" | "createdDate" | "createdBy">) => void;
  postSpt: (taxType: "PPN" | "UNIFIKASI" | "PPH21", month?: number, year?: number) => SptRecord;
  finalizeSpt: (id: string) => boolean;
  updateSptStatus: (id: string, status: SptRecord["status"]) => void;
  recordPayment: (id: string, ntpn: string, channel: string) => void;
  addPayment: (payment: Omit<PaymentRecord, "id">) => void;
  addVendor: (vendor: Omit<Vendor, "id">) => void;
  addBankAccount: (acc: Omit<BankAccount, "id">) => void;
  setPrimaryAccount: (id: string) => void;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;
  markAllNotificationsRead: () => void;
  clearCacheAndReset: () => void;

  // Reconciliation Engine
  reconcileRecords: () => ReconciliationItem[];

  // Practicum / Instructor Mode
  practicumBatches: PracticumBatch[];
  practicumAssignments: PracticumAssignment[];
  practicumSubmissions: PracticumSubmission[];
  addPracticumAssignment: (asg: Omit<PracticumAssignment, "id" | "createdAt">) => void;
  submitPracticum: (assignmentId: string, notes?: string, recordsCount?: number) => void;
  gradePracticumSubmission: (submissionId: string, score: number, feedback: string) => void;

  // Document Archive
  archivedDocs: ArchivedDocument[];
  archiveDocument: (doc: Omit<ArchivedDocument, "id" | "uploadedAt" | "uploadedBy" | "version">) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]);
  const [availableUsers, setAvailableUsers] = useState<User[]>(DEMO_USERS);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(INITIAL_SCHOOL_PROFILE);
  
  // Organization Context
  const [orgContext, setOrgContext] = useState<OrganizationContext>(INITIAL_ORG_CONTEXT);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("September-2026");

  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);

  // Core Data Collections
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [bupotList, setBupotList] = useState<WithholdingSlip[]>(INITIAL_BUPOT);
  const [sptList, setSptList] = useState<SptRecord[]>(INITIAL_SPT);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [journals, setJournals] = useState<JournalEntry[]>(INITIAL_JOURNALS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  // Layanan WP, e-Faktur Retur, Dokumen Lain, Kompensasi
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(INITIAL_SERVICE_REQUESTS);
  const [invoiceReturns, setInvoiceReturns] = useState<InvoiceReturn[]>(INITIAL_RETURNS);
  const [otherTaxDocuments, setOtherTaxDocuments] = useState<OtherTaxDocument[]>(INITIAL_OTHER_DOCS);
  const [compensations, setCompensations] = useState<CompensationRecord[]>(INITIAL_COMPENSATIONS);
  const [grossRevenues, setGrossRevenues] = useState<GrossRevenueRecord[]>(INITIAL_GROSS_REVENUES);

  // Practicum & Sandbox
  const [practicumBatches, setPracticumBatches] = useState<PracticumBatch[]>(INITIAL_PRACTICUM_BATCHES);
  const [practicumAssignments, setPracticumAssignments] = useState<PracticumAssignment[]>(INITIAL_PRACTICUM_ASSIGNMENTS);
  const [practicumSubmissions, setPracticumSubmissions] = useState<PracticumSubmission[]>(INITIAL_PRACTICUM_SUBMISSIONS);
  const [archivedDocs, setArchivedDocs] = useState<ArchivedDocument[]>(INITIAL_ARCHIVED_DOCS);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // RBAC Permission Helper
  const checkPermission = (perm: Permission): boolean => {
    return hasPermission(currentUser.role, perm);
  };

  // Load from localStorage on client side mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("natratax_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.id) {
          setCurrentUser(parsed);
        }
      }

      const savedTheme = localStorage.getItem("natratax_theme");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const showToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAudit = (action: AuditLog["action"], module: string, recordIdentifier: string, details: string) => {
    const newLog: AuditLog = {
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      module,
      recordIdentifier,
      details,
      ipAddress: "192.168.10.45",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const clearCacheAndReset = () => {
    try {
      localStorage.removeItem("natratax_user");
      sessionStorage.clear();
    } catch {
      // ignore
    }
    setCurrentUser(DEMO_USERS[0]);
    setAvailableUsers(DEMO_USERS);
    setVendors(INITIAL_VENDORS);
    setBankAccounts(INITIAL_BANK_ACCOUNTS);
    setSchoolProfile(INITIAL_SCHOOL_PROFILE);
    setTransactions(INITIAL_TRANSACTIONS);
    setInvoices(INITIAL_INVOICES);
    setBupotList(INITIAL_BUPOT);
    setSptList(INITIAL_SPT);
    setPayments(INITIAL_PAYMENTS);
    setJournals(INITIAL_JOURNALS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setOrgContext(INITIAL_ORG_CONTEXT);
    showToast({
      type: "success",
      title: "Data Cache Bersih",
      description: "Seluruh data cache telah direset ke kondisi bersih awal (Clean State).",
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("natratax_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("natratax_theme", "light");
      }
      return next;
    });
  };

  // Unit and Context Switchers
  const switchUnit = (unitId: string) => {
    const targetUnit = DEFAULT_UNITS.find((u) => u.id === unitId);
    if (!targetUnit) return;
    setOrgContext((prev) => ({
      ...prev,
      unitId: targetUnit.id,
      unitName: targetUnit.name,
    }));
    logAudit("UPDATE", "ORGANISASI", targetUnit.id, `Beralih ke unit aktif: ${targetUnit.name}`);
    showToast({
      type: "info",
      title: "Unit Aktif Diperbarui",
      description: `Beralih ke unit: ${targetUnit.name}`,
    });
  };

  const toggleOperatingMode = () => {
    setOrgContext((prev) => {
      const nextMode = prev.operatingMode === "LIVE_INTERNAL" ? "PRACTICUM_SANDBOX" : "LIVE_INTERNAL";
      logAudit("UPDATE", "SYSTEM", nextMode, `Beralih ke mode operasional: ${nextMode}`);
      showToast({
        type: nextMode === "PRACTICUM_SANDBOX" ? "warning" : "info",
        title: nextMode === "PRACTICUM_SANDBOX" ? "Mode Praktikum / Sandbox Aktif" : "Mode Operasional Nyata Aktif",
        description: nextMode === "PRACTICUM_SANDBOX" 
          ? "Data transaksi terisolasi dalam sandbox latihan siswa." 
          : "Kembali ke data penatausahaan riil sekolah.",
      });
      return { ...prev, operatingMode: nextMode };
    });
  };

  const setPeriod = (month: number, year: number) => {
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const label = `${monthNames[month - 1]} ${year}`;
    setOrgContext((prev) => ({
      ...prev,
      periodMonth: month,
      periodYear: year,
      periodLabel: label,
      fiscalYear: String(year),
    }));
    setSelectedPeriod(`${monthNames[month - 1]}-${year}`);
    showToast({
      type: "info",
      title: "Masa Pajak Aktif",
      description: `Periode pelaporan diubah ke ${label}`,
    });
  };

  // Role Switching with Pre-configured Sample Users
  const switchRole = (role: UserRole) => {
    let found = availableUsers.find((u) => u.role === role);
    if (!found) {
      const sample = ROLE_SAMPLE_USERS[role];
      if (sample) {
        found = {
          ...sample,
          id: `usr-${role.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        };
        setAvailableUsers((prev) => [...prev, found!]);
      } else {
        found = DEMO_USERS[0];
      }
    }

    setCurrentUser(found);
    try {
      localStorage.setItem("natratax_user", JSON.stringify(found));
    } catch {
      // ignore
    }

    logAudit("LOGIN", "AUTH", found.id, `Berganti peran aktif ke ${role} (${found.name})`);
    showToast({
      type: "info",
      title: "Peran Aktif Diperbarui",
      description: `Beralih ke ${role}: ${found.name}`,
    });
  };

  // Master Flow 1: ADD TRANSACTION with Deterministic Tax Engine & Cross-Module Auto-Generation
  const addTransaction = (trx: Omit<Transaction, "id" | "trxNumber" | "createdBy">) => {
    const id = "trx-" + Date.now();
    const trxNumber = `TRX-BP-${orgContext.fiscalYear}-${String(orgContext.periodMonth).padStart(2, "0")}-${String(transactions.length + 1).padStart(3, "0")}`;
    
    // Calculate deterministic tax using centralized Tax Engine
    let calcResult;
    try {
      calcResult = TaxCalculationService.calculate({
        taxType: trx.taxType,
        grossAmount: trx.grossAmount,
        hasNpwp: true,
        transactionDate: trx.date,
        taxObjectCode: trx.taxObjectCode,
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Perhitungan Pajak Gagal",
        description: err?.message || "Tidak dapat memvalidasi aturan pajak transaksi.",
      });
      return;
    }

    const newTrx: Transaction = {
      ...trx,
      id,
      trxNumber,
      taxBase: calcResult.taxBase,
      taxRate: calcResult.effectiveRate,
      taxAmount: calcResult.taxAmount,
      netAmount: calcResult.netAmount,
      taxObjectCode: calcResult.taxObjectCode,
      organizationId: orgContext.organizationId,
      unitId: orgContext.unitId,
      periodId: selectedPeriod,
      operatingMode: orgContext.operatingMode,
      createdBy: currentUser.name,
    };

    setTransactions((prev) => [newTrx, ...prev]);

    // Data Lineage: Auto-generate Tax Document based on transaction type
    if (newTrx.taxType === "PPN") {
      const isOutgoing = newTrx.type === "OPERASIONAL" || newTrx.type === "SEWA_GEDUNG";
      const invoiceNumber = `INV-${isOutgoing ? "OUT" : "IN"}-${Date.now().toString().slice(-6)}`;
      const newInvoice: Invoice = {
        id: "inv-" + Date.now(),
        invoiceNumber,
        taxInvoiceNumber: `0${isOutgoing ? "10" : "01"}.000-26.${String(Date.now()).slice(-8)}`,
        type: isOutgoing ? "KELUARAN" : "MASUKAN",
        date: newTrx.date,
        counterpartyName: newTrx.vendorName,
        counterpartyNpwp: newTrx.vendorNpwp,
        dpp: newTrx.taxBase,
        ppnRate: newTrx.taxRate,
        ppnAmount: newTrx.taxAmount,
        total: newTrx.grossAmount,
        status: "DRAFT",
        createdBy: currentUser.name,
        period: `${String(orgContext.periodMonth).padStart(2, "0")}-${orgContext.periodYear}`,
        isCreditable: true,
        sourceTransactionId: id,
        organizationId: orgContext.organizationId,
        unitId: orgContext.unitId,
        operatingMode: orgContext.operatingMode,
      };
      setInvoices((prev) => [newInvoice, ...prev]);
    } else if (newTrx.taxAmount > 0) {
      let bType: WithholdingSlip["bupotType"] = "BPPU";
      if (newTrx.taxType === "PPH21") bType = "BP21";
      else if (newTrx.taxType === "PPH4_2") bType = "BP4_2";

      const bupotNumber = `BP-${newTrx.taxType}-${orgContext.fiscalYear}-${String(bupotList.length + 1).padStart(4, "0")}`;
      const newBupot: WithholdingSlip = {
        id: "bupot-" + Date.now(),
        bupotNumber,
        bupotType: bType,
        taxType: newTrx.taxType,
        taxObjectCode: newTrx.taxObjectCode || "GENERIC",
        objectDescription: newTrx.description,
        beneficiaryName: newTrx.vendorName,
        beneficiaryNpwpNik: newTrx.vendorNpwp,
        grossAmount: newTrx.grossAmount,
        effectiveRate: newTrx.taxRate,
        taxWithheld: newTrx.taxAmount,
        periodMonth: orgContext.periodMonth,
        periodYear: orgContext.periodYear,
        status: "DRAFT",
        dateCreated: newTrx.date,
        createdBy: currentUser.name,
        sourceTransactionId: id,
        organizationId: orgContext.organizationId,
        unitId: orgContext.unitId,
        operatingMode: orgContext.operatingMode,
      };
      setBupotList((prev) => [newBupot, ...prev]);
    }

    // Ledger Integration: Auto-record double-entry transaction
    const journalId = "jrn-" + Date.now();
    const newJournal: JournalEntry = {
      id: journalId,
      date: newTrx.date,
      refNumber: trxNumber,
      accountCode: "5.1.02.01",
      accountName: `Beban ${newTrx.categoryName} (${orgContext.unitName})`,
      description: `${newTrx.description} - Rekanan: ${newTrx.vendorName}`,
      debit: newTrx.grossAmount,
      credit: newTrx.grossAmount,
      taxRef: `${newTrx.taxType} (Rp ${newTrx.taxAmount.toLocaleString("id-ID")})`,
    };
    setJournals((prev) => [newJournal, ...prev]);

    logAudit("CREATE", "TRANSAKSI", trxNumber, `Input transaksi ${newTrx.categoryName} Rp ${newTrx.grossAmount.toLocaleString("id-ID")} (${newTrx.taxType})`);
    showToast({
      type: "success",
      title: "Transaksi & Dokumen Pajak Dibuat",
      description: `${trxNumber} berhasil direkam ke e-Faktur/e-Bupot & Buku Kas.`,
    });
  };

  // Master Flow 2: APPROVE TRANSACTION with Segregation of Duties & Auto-Issue
  const approveTransaction = (id: string) => {
    if (!checkPermission("transaction.approve")) {
      showToast({
        type: "error",
        title: "Akses Otorisasi Ditolak",
        description: `Peran ${currentUser.role} tidak memiliki kewenangan verifikasi/approval keuangan.`,
      });
      return;
    }

    const target = transactions.find((t) => t.id === id);
    if (!target) {
      showToast({ type: "error", title: "Transaksi Tidak Ditemukan", description: `ID: ${id}` });
      return;
    }

    if (target.status === "CANCELLED" || target.status === "PAID") {
      showToast({
        type: "warning",
        title: "Transisi Status Dilarang",
        description: `Transaksi berstatus ${target.status} tidak dapat disetujui secara langsung.`,
      });
      return;
    }

    if (target.createdBy === currentUser.name && currentUser.role !== "SUPER ADMIN" && currentUser.role !== "KEPALA SEKOLAH") {
      showToast({
        type: "warning",
        title: "Pelanggaran Segregation of Duties",
        description: "Pembuat transaksi tidak dapat menyetujui transaksi miliknya sendiri.",
      });
      return;
    }

    // Update Transaction status to APPROVED
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "APPROVED" } : t))
    );

    // Auto-issue linked Invoice (lock into TERBIT)
    setInvoices((prev) =>
      prev.map((inv) => inv.sourceTransactionId === id ? { ...inv, status: "TERBIT" } : inv)
    );

    // Auto-issue linked Bupot (lock into TERBIT with verified signature)
    setBupotList((prev) =>
      prev.map((b) => b.sourceTransactionId === id ? { 
        ...b, 
        status: "TERBIT", 
        signatureVerified: true, 
        signerName: currentUser.name, 
        signerNpwp: currentUser.taxId 
      } : b)
    );

    logAudit("APPROVE", "TRANSAKSI", target.trxNumber, `Menyetujui transaksi ${target.trxNumber} & menerbitkan dokumen pajak terkait`);
    showToast({
      type: "success",
      title: "Transaksi & Dokumen Pajak Disetujui",
      description: `${target.trxNumber} disetujui. Dokumen e-Faktur/e-Bupot otomatis diterbitkan (TERBIT).`,
    });
  };

  // Master Flow 3: POST SPT (Auto-Aggregation from Source Records without duplicate entry)
  const postSpt = (taxType: "PPN" | "UNIFIKASI" | "PPH21", month?: number, year?: number): SptRecord => {
    const targetMonth = month || orgContext.periodMonth;
    const targetYear = year || orgContext.periodYear;
    const periodLabel = `${orgContext.periodLabel}`;

    let totalDpp = 0;
    let totalTax = 0;
    let taxOutput = 0;
    let creditableInput = 0;
    let taxPosition: SptRecord["taxPosition"] = "NIHIL";
    let sourceInvoiceIds: string[] = [];
    let sourceBupotIds: string[] = [];
    let sourceTransactionIds: string[] = [];

    if (taxType === "PPN") {
      const activeInvoices = invoices.filter(
        (inv) => inv.status === "TERBIT" && inv.operatingMode === orgContext.operatingMode
      );
      sourceInvoiceIds = activeInvoices.map((inv) => inv.id);

      const keluaran = activeInvoices.filter((inv) => inv.type === "KELUARAN");
      const masukan = activeInvoices.filter((inv) => inv.type === "MASUKAN" && inv.isCreditable !== false);

      taxOutput = keluaran.reduce((sum, inv) => sum + inv.ppnAmount, 0);
      creditableInput = masukan.reduce((sum, inv) => sum + inv.ppnAmount, 0);
      totalDpp = activeInvoices.reduce((sum, inv) => sum + inv.dpp, 0);

      const netPpn = taxOutput - creditableInput;
      if (netPpn > 0) {
        taxPosition = "KURANG_BAYAR";
        totalTax = netPpn;
      } else if (netPpn < 0) {
        taxPosition = "LEBIH_BAYAR";
        totalTax = Math.abs(netPpn);
      } else {
        taxPosition = "NIHIL";
        totalTax = 0;
      }
    } else if (taxType === "UNIFIKASI") {
      const activeBupots = bupotList.filter(
        (b) => b.status === "TERBIT" && (b.bupotType === "BPPU" || b.bupotType === "BPNR" || b.bupotType === "BP4_2") &&
               b.operatingMode === orgContext.operatingMode
      );
      sourceBupotIds = activeBupots.map((b) => b.id);
      totalDpp = activeBupots.reduce((sum, b) => sum + b.grossAmount, 0);
      totalTax = activeBupots.reduce((sum, b) => sum + b.taxWithheld, 0);
      taxPosition = totalTax > 0 ? "KURANG_BAYAR" : "NIHIL";
    } else if (taxType === "PPH21") {
      const activeBupots = bupotList.filter(
        (b) => b.status === "TERBIT" && (b.bupotType === "BP21" || b.bupotType === "BP_A1" || b.bupotType === "BP_A2") &&
               b.operatingMode === orgContext.operatingMode
      );
      sourceBupotIds = activeBupots.map((b) => b.id);
      totalDpp = activeBupots.reduce((sum, b) => sum + b.grossAmount, 0);
      totalTax = activeBupots.reduce((sum, b) => sum + b.taxWithheld, 0);
      taxPosition = totalTax > 0 ? "KURANG_BAYAR" : "NIHIL";
    }

    const sptTitle = taxType === "PPN" ? "SPT Masa PPN 1107 PUT" : taxType === "UNIFIKASI" ? "SPT Masa Unifikasi" : "SPT Masa PPh 21/26";
    const existingIndex = sptList.findIndex((s) => s.taxType === sptTitle && s.periodMonth === targetMonth && s.periodYear === targetYear);
    
    const billingCode = taxPosition === "KURANG_BAYAR" ? `BIL-${taxType}-${targetYear}${String(targetMonth).padStart(2, "0")}-${String(Date.now()).slice(-4)}` : undefined;

    const newSpt: SptRecord = {
      id: existingIndex >= 0 ? sptList[existingIndex].id : "spt-" + Date.now(),
      taxType: sptTitle,
      sptCategory: "MASA",
      taxPeriod: periodLabel,
      periodMonth: targetMonth,
      periodYear: targetYear,
      totalDpp,
      totalTax,
      taxOutput,
      creditableInput,
      taxPosition,
      status: taxPosition === "KURANG_BAYAR" ? "PAYMENT_REQUIRED" : "READY_TO_FINALIZE",
      createdDate: new Date().toISOString().split("T")[0],
      createdBy: currentUser.name,
      billingCode,
      sourceInvoiceIds,
      sourceBupotIds,
      sourceTransactionIds,
      organizationId: orgContext.organizationId,
      unitId: orgContext.unitId,
      operatingMode: orgContext.operatingMode,
    };

    if (existingIndex >= 0) {
      setSptList((prev) => prev.map((s, idx) => idx === existingIndex ? newSpt : s));
    } else {
      setSptList((prev) => [newSpt, ...prev]);
    }

    // Auto-generate Billing in payments module if Kurang Bayar
    if (taxPosition === "KURANG_BAYAR" && billingCode) {
      const newPayment: PaymentRecord = {
        id: "pay-" + Date.now(),
        billingCode,
        taxType: sptTitle,
        period: periodLabel,
        amount: totalTax,
        dueDate: `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-10`,
        status: "PENDING",
        referenceNote: `Tagihan Setoran SPT Masa ${sptTitle} Periode ${periodLabel}`,
      };
      setPayments((prev) => [newPayment, ...prev]);
    }

    logAudit("CREATE", "SPT", sptTitle, `Posting agregasi otomatis ${sptTitle} Periode ${periodLabel} total pajak Rp ${totalTax.toLocaleString("id-ID")}`);
    showToast({
      type: "success",
      title: "SPT Berhasil Diposting",
      description: `${sptTitle} teragregasi otomatis dari ${sourceInvoiceIds.length + sourceBupotIds.length} dokumen sumber. Posisi: ${taxPosition}.`,
    });

    return newSpt;
  };

  // Master Flow 4: FINALIZE SPT with Checklist Validation & Immutable Snapshot
  const finalizeSpt = (id: string): boolean => {
    if (!checkPermission("spt.finalize")) {
      showToast({
        type: "error",
        title: "Akses Finalisasi Ditolak",
        description: `Peran ${currentUser.role} tidak memiliki kewenangan finalisasi SPT.`,
      });
      return false;
    }

    const target = sptList.find((s) => s.id === id);
    if (!target) {
      showToast({ type: "error", title: "SPT Tidak Ditemukan", description: `ID: ${id}` });
      return false;
    }

    if (target.status === "FINALIZED" || target.status === "LOCKED") {
      showToast({
        type: "warning",
        title: "SPT Sudah Difinalisasi",
        description: "Dokumen SPT yang telah difinalisasi bersifat permanen dan tidak dapat diubah.",
      });
      return false;
    }

    // Finalization Checklist: Check payment requirement
    if (target.taxPosition === "KURANG_BAYAR" && !target.ntpn) {
      const linkedPayment = payments.find((p) => p.billingCode === target.billingCode && p.status === "PAID");
      if (!linkedPayment) {
        showToast({
          type: "warning",
          title: "Pembayaran Belum Divalidasi",
          description: `SPT berposisi Kurang Bayar (Rp ${target.totalTax.toLocaleString("id-ID")}). Silakan lunasi kode billing ${target.billingCode} terlebih dahulu.`,
        });
        return false;
      }
    }

    // Create immutable snapshot of the SPT state
    const snapshot = JSON.stringify({
      sptId: target.id,
      taxType: target.taxType,
      period: target.taxPeriod,
      totalDpp: target.totalDpp,
      totalTax: target.totalTax,
      taxPosition: target.taxPosition,
      sourceInvoiceIds: target.sourceInvoiceIds,
      sourceBupotIds: target.sourceBupotIds,
      finalizedBy: currentUser.name,
      finalizedAt: new Date().toISOString(),
      schoolNpwp: schoolProfile.taxId,
      schoolName: schoolProfile.name,
    });

    setSptList((prev) =>
      prev.map((s) => s.id === id ? {
        ...s,
        status: "FINALIZED",
        finalizedAt: new Date().toISOString(),
        finalizedBy: currentUser.name,
        snapshotData: snapshot,
      } : s)
    );

    logAudit("APPROVE", "SPT", target.taxType, `Finalisasi resmi & penguncian arsip SPT Masa ${target.taxType} periode ${target.taxPeriod}`);
    showToast({
      type: "success",
      title: "SPT Berhasil Difinalisasi & Dikunci",
      description: `Snapshot digital terbentuk. Status: FINALIZED (Arsip Sah Satuan Pendidikan).`,
    });

    return true;
  };

  // Master Flow 5: RECORD PAYMENT with NTPN Verification & Automatic Ledger Update
  const recordPayment = (id: string, ntpn: string, channel: string) => {
    if (!checkPermission("payment.verify")) {
      showToast({
        type: "error",
        title: "Akses Ditolak",
        description: "Hanya Verifikator, Bendahara, atau Admin yang dapat memverifikasi bukti setoran pajak.",
      });
      return;
    }

    // NTPN validation (16 alphanumeric chars)
    const cleanNtpn = ntpn.trim().toUpperCase();
    if (cleanNtpn.length < 16) {
      showToast({
        type: "error",
        title: "Format NTPN Tidak Sah",
        description: "Nomor Transaksi Penerimaan Negara (NTPN) wajib memiliki minimal 16 digit alfanumerik resmi kas negara.",
      });
      return;
    }

    // Duplicate NTPN check
    const isDuplicate = payments.some((p) => p.ntpn === cleanNtpn && p.id !== id);
    if (isDuplicate) {
      showToast({
        type: "error",
        title: "Duplikasi NTPN Terdeteksi",
        description: `NTPN ${cleanNtpn} sudah pernah dicatat dalam sistem sebelumnya. Penyetoran ganda ditolak.`,
      });
      return;
    }

    const targetPayment = payments.find((p) => p.id === id);
    if (!targetPayment) return;

    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "PAID",
              ntpn: cleanNtpn,
              paymentChannel: channel,
              paymentDate: new Date().toISOString().split("T")[0],
            }
          : p
      )
    );

    // Update corresponding SPT status to DILAPORKAN / READY_TO_REPORT with NTPN
    if (targetPayment.billingCode) {
      setSptList((prev) =>
        prev.map((s) => s.billingCode === targetPayment.billingCode ? {
          ...s,
          ntpn: cleanNtpn,
          status: "DILAPORKAN",
        } : s)
      );
    }

    // Ledger Integration: Record Debit Utang Pajak, Credit Kas Bank BOS
    const newJournal: JournalEntry = {
      id: "jrn-pay-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      refNumber: cleanNtpn,
      accountCode: "2.1.01.01",
      accountName: "Utang Pajak Kas Negara (NTPN Validasi)",
      description: `Penyetoran Kas Negara ${targetPayment.taxType} NTPN: ${cleanNtpn} via ${channel}`,
      debit: targetPayment.amount,
      credit: targetPayment.amount,
      taxRef: targetPayment.billingCode,
    };
    setJournals((prev) => [newJournal, ...prev]);

    logAudit("PAYMENT", "PEMBAYARAN", targetPayment.billingCode, `Penyetoran lunas NTPN: ${cleanNtpn} senilai Rp ${targetPayment.amount.toLocaleString("id-ID")}`);
    showToast({
      type: "success",
      title: "Setoran Pajak Tervalidasi Kas Negara",
      description: `Billing ${targetPayment.billingCode} lunas dengan NTPN ${cleanNtpn}. Buku Besar & SPT otomatis terupdate.`,
    });
  };

  // Reconciliation Engine (Cross-checks Transactions, Tax Documents, SPT, Payments, Ledger)
  const reconcileRecords = (): ReconciliationItem[] => {
    const items: ReconciliationItem[] = [];

    // 1. Transactions vs Tax Documents
    transactions.forEach((trx) => {
      let matchedAmount = 0;
      let status: ReconciliationItem["status"] = "MATCHED";
      let discrepancyType: ReconciliationItem["discrepancyType"];
      let notes = "Transaksi dan dokumen pajak telah sesuai.";

      if (trx.taxType === "PPN") {
        const inv = invoices.find((i) => i.sourceTransactionId === trx.id);
        if (!inv) {
          status = "MISMATCH";
          discrepancyType = "MISSING_RECORD";
          notes = "Faktur PPN belum diterbitkan untuk transaksi ini.";
        } else {
          matchedAmount = inv.total;
          if (inv.total !== trx.grossAmount) {
            status = "MISMATCH";
            discrepancyType = "AMOUNT_MISMATCH";
            notes = `Selisih nilai transaksi (Rp ${trx.grossAmount}) vs Faktur (Rp ${inv.total}).`;
          } else if (inv.status === "DRAFT") {
            status = "NEEDS_REVIEW";
            notes = "Faktur masih berstatus Draft, menunggu approval.";
          }
        }
      } else if (trx.taxAmount > 0) {
        const bp = bupotList.find((b) => b.sourceTransactionId === trx.id);
        if (!bp) {
          status = "MISMATCH";
          discrepancyType = "MISSING_RECORD";
          notes = "Bukti Potong belum diterbitkan.";
        } else {
          matchedAmount = bp.grossAmount;
          if (bp.grossAmount !== trx.grossAmount) {
            status = "MISMATCH";
            discrepancyType = "AMOUNT_MISMATCH";
            notes = "Nilai bruto transaksi tidak cocok dengan Bukti Potong.";
          } else if (bp.status === "DRAFT") {
            status = "NEEDS_REVIEW";
            notes = "Bukti Potong menunggu verifikasi tanda tangan.";
          }
        }
      } else {
        matchedAmount = trx.grossAmount;
      }

      items.push({
        id: "rec-trx-" + trx.id,
        entityType: "TRANSACTION",
        referenceNumber: trx.trxNumber,
        date: trx.date,
        period: trx.periodId || selectedPeriod,
        sourceAmount: trx.grossAmount,
        matchedAmount,
        difference: Math.abs(trx.grossAmount - matchedAmount),
        status,
        discrepancyType,
        notes,
      });
    });

    // 2. SPT vs Payments
    sptList.forEach((spt) => {
      if (spt.taxPosition === "KURANG_BAYAR") {
        const payment = payments.find((p) => p.billingCode === spt.billingCode);
        let status: ReconciliationItem["status"] = "MATCHED";
        let notes = "Kewajiban pajak telah disetor penuh.";

        if (!payment) {
          status = "UNRESOLVED";
          notes = "Kode billing belum dibentuk untuk SPT Kurang Bayar ini.";
        } else if (payment.status !== "PAID") {
          status = "NEEDS_REVIEW";
          notes = `Menunggu penyetoran kode billing ${payment.billingCode}.`;
        }

        items.push({
          id: "rec-spt-" + spt.id,
          entityType: "SPT",
          referenceNumber: spt.taxType,
          date: spt.createdDate,
          period: spt.taxPeriod,
          sourceAmount: spt.totalTax,
          matchedAmount: payment?.status === "PAID" ? payment.amount : 0,
          difference: payment?.status === "PAID" ? 0 : spt.totalTax,
          status,
          discrepancyType: payment?.status !== "PAID" ? "PAYMENT_MISMATCH" : undefined,
          notes,
        });
      }
    });

    return items;
  };

  // Practicum Actions
  const addPracticumAssignment = (asg: Omit<PracticumAssignment, "id" | "createdAt">) => {
    const newAsg: PracticumAssignment = {
      ...asg,
      id: "asg-" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPracticumAssignments((prev) => [newAsg, ...prev]);
    logAudit("CREATE", "PRAKTIKUM", newAsg.title, `Instruktur menambahkan tugas praktikum baru`);
    showToast({
      type: "success",
      title: "Tugas Praktikum Diterbitkan",
      description: `${newAsg.title} aktif untuk kelas peserta.`,
    });
  };

  const submitPracticum = (assignmentId: string, notes?: string, recordsCount: number = 1) => {
    const targetAsg = practicumAssignments.find((a) => a.id === assignmentId);
    const newSub: PracticumSubmission = {
      id: "sub-" + Date.now(),
      assignmentId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      submissionDate: new Date().toISOString().split("T")[0],
      status: "SUBMITTED",
      notes: notes || "Tugas diselesaikan dengan input transaksi dan e-Bupot/SPT di mode sandbox.",
      submittedRecordsCount: recordsCount,
    };
    setPracticumSubmissions((prev) => [newSub, ...prev]);
    logAudit("CREATE", "PRAKTIKUM", targetAsg?.title || assignmentId, `Siswa menyerahkan jawaban praktikum perpajakan`);
    showToast({
      type: "success",
      title: "Tugas Berhasil Dikirimkan",
      description: `Jawaban praktikum telah dikirimkan ke instruktur untuk dinilai.`,
    });
  };

  const gradePracticumSubmission = (submissionId: string, score: number, feedback: string) => {
    setPracticumSubmissions((prev) =>
      prev.map((s) => s.id === submissionId ? {
        ...s,
        status: "GRADED",
        score,
        feedback,
      } : s)
    );
    logAudit("UPDATE", "PRAKTIKUM", submissionId, `Instruktur memberikan nilai ${score}/100`);
    showToast({
      type: "success",
      title: "Penilaian Berhasil Disimpan",
      description: `Nilai: ${score}/100 beserta feedback telah dikirimkan ke siswa.`,
    });
  };

  // Document Archive Action
  const archiveDocument = (doc: Omit<ArchivedDocument, "id" | "uploadedAt" | "uploadedBy" | "version">) => {
    const newDoc: ArchivedDocument = {
      ...doc,
      id: "arch-" + Date.now(),
      version: 1,
      uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      uploadedBy: currentUser.name,
    };
    setArchivedDocs((prev) => [newDoc, ...prev]);
    logAudit("CREATE", "DOKUMEN", newDoc.referenceNumber, `Mengarsipkan dokumen ${newDoc.title} (${newDoc.category})`);
    showToast({
      type: "success",
      title: "Dokumen Berhasil Diarsipkan",
      description: `${newDoc.title} tersimpan aman di repositori arsip resmi.`,
    });
  };

  // Additional Support Functions
  const addInvoice = (inv: Omit<Invoice, "id" | "createdBy">) => {
    const id = "inv-" + Date.now();
    const newInvoice: Invoice = {
      ...inv,
      id,
      createdBy: currentUser.name,
      organizationId: orgContext.organizationId,
      unitId: orgContext.unitId,
      operatingMode: orgContext.operatingMode,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    logAudit("CREATE", "E-FAKTUR", newInvoice.invoiceNumber, `Menerbitkan faktur ${newInvoice.taxInvoiceNumber} sebesar Rp ${newInvoice.total.toLocaleString("id-ID")}`);
    showToast({
      type: "success",
      title: "Faktur Berhasil Dibuat",
      description: `Faktur ${newInvoice.invoiceNumber} (${newInvoice.type}) tersimpan.`,
    });
  };

  const addBupot = (bupot: Omit<WithholdingSlip, "id" | "bupotNumber" | "createdBy" | "dateCreated">) => {
    const id = "bupot-" + Date.now();
    const bupotNumber = `BP-${bupot.taxType}-${orgContext.fiscalYear}-${String(bupotList.length + 1).padStart(4, "0")}`;
    const newBupot: WithholdingSlip = {
      ...bupot,
      id,
      bupotNumber,
      createdBy: currentUser.name,
      dateCreated: new Date().toISOString().split("T")[0],
      organizationId: orgContext.organizationId,
      unitId: orgContext.unitId,
      operatingMode: orgContext.operatingMode,
    };
    setBupotList((prev) => [newBupot, ...prev]);
    logAudit("CREATE", "E-BUPOT", bupotNumber, `Membuat Bukti Potong atas nama ${newBupot.beneficiaryName} senilai Rp ${newBupot.taxWithheld.toLocaleString("id-ID")}`);
    showToast({
      type: "success",
      title: "Bukti Potong Diterbitkan",
      description: `Bukti Potong ${bupotNumber} telah berhasil dibuat.`,
    });
  };

  const addSpt = (spt: Omit<SptRecord, "id" | "createdDate" | "createdBy">) => {
    const id = "spt-" + Date.now();
    const newSpt: SptRecord = {
      ...spt,
      id,
      createdDate: new Date().toISOString().split("T")[0],
      createdBy: currentUser.name,
      organizationId: orgContext.organizationId,
      unitId: orgContext.unitId,
      operatingMode: orgContext.operatingMode,
    };
    setSptList((prev) => [newSpt, ...prev]);
    logAudit("CREATE", "SPT", newSpt.taxType, `Membuat Konsep ${newSpt.taxType} periode ${newSpt.taxPeriod} sebesar Rp ${newSpt.totalTax.toLocaleString("id-ID")}`);
    showToast({
      type: "success",
      title: "Konsep SPT Berhasil Dibuat",
      description: `${newSpt.taxType} untuk periode ${newSpt.taxPeriod} tersimpan.`,
    });
  };

  const updateSptStatus = (id: string, status: SptRecord["status"]) => {
    setSptList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    const target = sptList.find((s) => s.id === id);
    logAudit("UPDATE", "SPT", target?.taxType || id, `Status SPT diubah menjadi ${status}`);
    showToast({
      type: "info",
      title: "Status SPT Diperbarui",
      description: `${target?.taxType} sekarang berstatus: ${status}`,
    });
  };

  const addUser = (userData: Omit<User, "id">) => {
    const id = "usr-" + Date.now();
    const newUser: User = { ...userData, id };
    setAvailableUsers((prev) => [...prev, newUser]);
    logAudit("CREATE", "PENGGUNA", newUser.email, `Menambahkan pengguna baru: ${newUser.name} (${newUser.role})`);
    showToast({
      type: "success",
      title: "Pengguna Berhasil Ditambahkan",
      description: `${newUser.name} sebagai ${newUser.role} berhasil didaftarkan.`,
    });
  };

  const addMitra = (mitraData: {
    companyName: string;
    picName: string;
    npwp: string;
    category: string;
    email: string;
    phone: string;
    address?: string;
  }): User => {
    const id = "usr-mitra-" + Date.now();
    const newMitraUser: User = {
      id,
      name: `${mitraData.picName} - ${mitraData.companyName}`,
      email: mitraData.email,
      role: "MITRA",
      taxId: mitraData.npwp,
      schoolName: "SMK BINA PUTRA JAKARTA (MITRA REKANAN)",
      department: mitraData.category,
      partnerCompany: mitraData.companyName,
      partnerCategory: mitraData.category,
      partnerPhone: mitraData.phone,
    };

    setAvailableUsers((prev) => [...prev, newMitraUser]);

    const newVendor: Vendor = {
      id: "v-mitra-" + Date.now(),
      name: mitraData.companyName,
      npwp: mitraData.npwp,
      type: "KEMITRAAN DU/DI",
      category: mitraData.category,
      bankAccount: "Bank DKI - 102.20." + Math.floor(10000 + Math.random() * 90000),
      city: "Jakarta Timur",
      status: "TERDAFTAR RESMI",
      phone: mitraData.phone,
      address: mitraData.address || "DKI Jakarta",
    };
    setVendors((prev) => [newVendor, ...prev]);

    logAudit("CREATE", "MITRA", newMitraUser.taxId, `Pendaftaran mitra baru: ${mitraData.companyName} (${mitraData.category})`);
    showToast({
      type: "success",
      title: "Pendaftaran Mitra Berhasil",
      description: `Kemitraan ${mitraData.companyName} terverifikasi aktif. Selamat datang di Portal Mitra!`,
    });

    setCurrentUser(newMitraUser);
    try {
      localStorage.setItem("natratax_user", JSON.stringify(newMitraUser));
    } catch {
      // ignore
    }

    return newMitraUser;
  };

  const addPayment = (paymentData: Omit<PaymentRecord, "id">) => {
    const id = "pay-" + Date.now();
    const newPayment: PaymentRecord = { ...paymentData, id };
    setPayments((prev) => [newPayment, ...prev]);
    logAudit("CREATE", "PEMBAYARAN", newPayment.billingCode, `Membuat tagihan/billing setoran pajak ${newPayment.taxType} Rp ${newPayment.amount.toLocaleString("id-ID")}`);
    showToast({
      type: "success",
      title: "Kode Billing Dibuat",
      description: `Billing ${newPayment.billingCode} senilai Rp ${newPayment.amount.toLocaleString("id-ID")} siap disetor.`,
    });
  };

  const addVendor = (vendorData: Omit<Vendor, "id">) => {
    const id = "v-" + Date.now();
    const newVendor: Vendor = { ...vendorData, id };
    setVendors((prev) => [...prev, newVendor]);
    logAudit("CREATE", "VENDOR", newVendor.name, `Menambahkan rekanan baru ${newVendor.name} (${newVendor.type})`);
    showToast({
      type: "success",
      title: "Rekanan Berhasil Ditambahkan",
      description: `${newVendor.name} telah disimpan dalam master rekanan.`,
    });
  };

  const addBankAccount = (accData: Omit<BankAccount, "id">) => {
    const id = "acc-" + Date.now();
    const newAccount: BankAccount = { ...accData, id };
    setBankAccounts((prev) => [...prev, newAccount]);
    logAudit("CREATE", "REKENING", newAccount.accountNumber, `Menambahkan rekening kas ${newAccount.bankName} - ${newAccount.accountNumber}`);
    showToast({
      type: "success",
      title: "Rekening Berhasil Ditambahkan",
      description: `${newAccount.bankName} (${newAccount.accountNumber}) berhasil disimpan.`,
    });
  };

  const setPrimaryAccount = (id: string) => {
    setBankAccounts((prev) =>
      prev.map((acc) => ({ ...acc, isPrimary: acc.id === id }))
    );
    showToast({
      type: "success",
      title: "Rekening Utama Diperbarui",
      description: "Rekening utama kas sekolah berhasil diubah.",
    });
  };

  const updateSchoolProfile = (updated: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => ({ ...prev, ...updated }));
    logAudit("UPDATE", "PROFIL", "SEKOLAH", "Memperbarui profil data satuan pendidikan");
    showToast({
      type: "success",
      title: "Profil Sekolah Diperbarui",
      description: "Data identitas & penanggung jawab sekolah berhasil disimpan.",
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast({
      type: "info",
      title: "Notifikasi Dibaca",
      description: "Semua pemberitahuan telah ditandai telah dibaca.",
    });
  };

  const addServiceRequest = (reqData: Omit<ServiceRequest, "id" | "ticketNumber" | "dateSubmitted">): ServiceRequest => {
    const id = "req-" + Date.now();
    const prefix = reqData.type.slice(0, 4).toUpperCase();
    const ticketNumber = `${prefix}-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
    const today = new Date().toISOString().split("T")[0];
    const newReq: ServiceRequest = {
      ...reqData,
      id,
      ticketNumber,
      dateSubmitted: today,
      bpeNumber: `BPE-${prefix}-${new Date().getFullYear()}${String(Date.now()).slice(-6)}`,
    };
    setServiceRequests((prev) => [newReq, ...prev]);
    logAudit("CREATE", "LAYANAN_WP", newReq.ticketNumber, `Mengajukan permohonan ${newReq.title}`);
    showToast({
      type: "success",
      title: "Permohonan Berhasil Dikirim",
      description: `Nomor Tiket: ${newReq.ticketNumber} sedang dalam pemrosesan.`,
    });
    return newReq;
  };

  const updateServiceRequestStatus = (id: string, status: ServiceRequestStatus, currentStep?: string, notes?: string) => {
    setServiceRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              ...(currentStep ? { currentStep } : {}),
              ...(notes ? { notes } : {}),
              progressPercent: status === "SELESAI" ? 100 : status === "DITOLAK" ? 100 : 75,
            }
          : r
      )
    );
    logAudit("UPDATE", "LAYANAN_WP", id, `Status permohonan diubah menjadi ${status}`);
    showToast({
      type: "info",
      title: "Status Layanan Diperbarui",
      description: `Status berkas sekarang: ${status}`,
    });
  };

  const addInvoiceReturn = (retData: Omit<InvoiceReturn, "id">) => {
    const id = "ret-" + Date.now();
    const newRet: InvoiceReturn = { ...retData, id };
    setInvoiceReturns((prev) => [newRet, ...prev]);
    logAudit("CREATE", "EFAKTUR", newRet.returnNumber, `Merekam nota retur ${newRet.type} nomor ${newRet.returnNumber} terkait faktur ${newRet.originalInvoiceNumber}`);
    showToast({
      type: "success",
      title: "Nota Retur Berhasil Direkam",
      description: `Nota Retur ${newRet.returnNumber} DPP Rp ${newRet.dppReturned.toLocaleString("id-ID")}`,
    });
  };

  const addOtherTaxDocument = (docData: Omit<OtherTaxDocument, "id">) => {
    const id = "oth-" + Date.now();
    const newDoc: OtherTaxDocument = { ...docData, id };
    setOtherTaxDocuments((prev) => [newDoc, ...prev]);
    logAudit("CREATE", "EFAKTUR", newDoc.documentNumber, `Merekam dokumen lain ${newDoc.documentType} nomor ${newDoc.documentNumber}`);
    showToast({
      type: "success",
      title: "Dokumen Lain Berhasil Direkam",
      description: `${newDoc.documentType} nomor ${newDoc.documentNumber} tersimpan.`,
    });
  };

  const applyCompensation = (id: string) => {
    setCompensations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "DIKOMPENSASI" as const } : c))
    );
    const target = compensations.find((c) => c.id === id);
    logAudit("UPDATE", "SPT", target?.decisionLetterNumber || id, `Kompensasi Rp ${target?.amount.toLocaleString("id-ID")} diterapkan`);
    showToast({
      type: "success",
      title: "Kompensasi Berhasil Diterapkan",
      description: `Saldo lebih bayar Rp ${target?.amount.toLocaleString("id-ID")} dikompensasikan ke SPT Masa berjalan.`,
    });
  };

  const addGrossRevenue = (recordData: Omit<GrossRevenueRecord, "id">) => {
    const id = "rev-" + Date.now();
    const newRec: GrossRevenueRecord = { ...recordData, id };
    setGrossRevenues((prev) => [newRec, ...prev]);
    logAudit("CREATE", "SPT", `Omset-${newRec.month}-${newRec.year}`, `Pencatatan omset Rp ${newRec.grossRevenue.toLocaleString("id-ID")}`);
    showToast({
      type: "success",
      title: "Pencatatan Omset Tersimpan",
      description: `Omset Rp ${newRec.grossRevenue.toLocaleString("id-ID")} dengan PPh Final Rp ${newRec.finalTaxDue.toLocaleString("id-ID")}.`,
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        availableUsers,
        addUser,
        addMitra,
        orgContext,
        switchUnit,
        toggleOperatingMode,
        setPeriod,
        selectedPeriod,
        setSelectedPeriod,
        hasPermission: checkPermission,
        isCompactMode,
        setIsCompactMode,
        isDarkMode,
        toggleDarkMode,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        transactions,
        invoices,
        bupotList,
        sptList,
        payments,
        journals,
        auditLogs,
        notifications,
        vendors,
        bankAccounts,
        schoolProfile,
        serviceRequests,
        addServiceRequest,
        updateServiceRequestStatus,
        invoiceReturns,
        addInvoiceReturn,
        otherTaxDocuments,
        addOtherTaxDocument,
        compensations,
        applyCompensation,
        grossRevenues,
        addGrossRevenue,
        addTransaction,
        approveTransaction,
        addInvoice,
        addBupot,
        addSpt,
        postSpt,
        finalizeSpt,
        updateSptStatus,
        recordPayment,
        addPayment,
        addVendor,
        addBankAccount,
        setPrimaryAccount,
        updateSchoolProfile,
        markAllNotificationsRead,
        clearCacheAndReset,
        reconcileRecords,
        practicumBatches,
        practicumAssignments,
        practicumSubmissions,
        addPracticumAssignment,
        submitPracticum,
        gradePracticumSubmission,
        archivedDocs,
        archiveDocument,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
