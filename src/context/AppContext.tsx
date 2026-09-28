"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, 
  UserRole, 
  Transaction, 
  Invoice, 
  WithholdingSlip, 
  SptRecord, 
  PaymentRecord, 
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
  GrossRevenueRecord
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
  INITIAL_GROSS_REVENUES
} from "@/lib/store";

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
  
  // Period filter
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;

  // Compact Mode ("Padatkan" toggle)
  isCompactMode: boolean;
  setIsCompactMode: (compact: boolean) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // UI Drawers & Modals
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;

  // Data Collections
  transactions: Transaction[];
  invoices: Invoice[];
  bupotList: WithholdingSlip[];
  sptList: SptRecord[];
  payments: PaymentRecord[];
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

  // Data Operations
  addTransaction: (trx: Omit<Transaction, "id" | "trxNumber" | "createdBy">) => void;
  approveTransaction: (id: string) => void;
  addInvoice: (inv: Omit<Invoice, "id" | "createdBy">) => void;
  addBupot: (bupot: Omit<WithholdingSlip, "id" | "bupotNumber" | "createdBy" | "dateCreated">) => void;
  addSpt: (spt: Omit<SptRecord, "id" | "createdDate" | "createdBy">) => void;
  updateSptStatus: (id: string, status: SptRecord["status"]) => void;
  recordPayment: (id: string, ntpn: string, channel: string) => void;
  addPayment: (payment: Omit<PaymentRecord, "id">) => void;
  addVendor: (vendor: Omit<Vendor, "id">) => void;
  addBankAccount: (acc: Omit<BankAccount, "id">) => void;
  setPrimaryAccount: (id: string) => void;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;
  markAllNotificationsRead: () => void;
  clearCacheAndReset: () => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(DEMO_USERS[0]); // Duwi Heru Santoso, Bendahara
  const [availableUsers, setAvailableUsers] = useState<User[]>(DEMO_USERS);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(INITIAL_SCHOOL_PROFILE);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("September-2026");
  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [bupotList, setBupotList] = useState<WithholdingSlip[]>(INITIAL_BUPOT);
  const [sptList, setSptList] = useState<SptRecord[]>(INITIAL_SPT);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(INITIAL_SERVICE_REQUESTS);
  const [invoiceReturns, setInvoiceReturns] = useState<InvoiceReturn[]>(INITIAL_RETURNS);
  const [otherTaxDocuments, setOtherTaxDocuments] = useState<OtherTaxDocument[]>(INITIAL_OTHER_DOCS);
  const [compensations, setCompensations] = useState<CompensationRecord[]>(INITIAL_COMPENSATIONS);
  const [grossRevenues, setGrossRevenues] = useState<GrossRevenueRecord[]>(INITIAL_GROSS_REVENUES);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from localStorage on client side mount with legacy cache cleansing
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("natratax_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (DEMO_USERS.some((u) => u.id === parsed.id)) {
          setCurrentUser(parsed);
        } else {
          // Stale legacy cache detected, purge to keep clean state
          localStorage.removeItem("natratax_user");
          setCurrentUser(DEMO_USERS[0]);
        }
      } else {
        setCurrentUser(DEMO_USERS[0]);
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
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
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

  const switchRole = (role: UserRole) => {
    const found = availableUsers.find((u) => u.role === role) || DEMO_USERS[0];
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
      description: `Beralih ke mode ${role}: ${found.name}`,
    });
  };

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

  const addTransaction = (trx: Omit<Transaction, "id" | "trxNumber" | "createdBy">) => {
    const id = "trx-" + Date.now();
    const trxNumber = `TRX-BP-2026-09-${String(transactions.length + 1).padStart(3, "0")}`;
    const newTrx: Transaction = {
      ...trx,
      id,
      trxNumber,
      createdBy: currentUser.name,
    };
    setTransactions((prev) => [newTrx, ...prev]);
    logAudit("CREATE", "TRANSAKSI", trxNumber, `Menambahkan transaksi ${newTrx.categoryName} senilai Rp ${newTrx.grossAmount.toLocaleString("id-ID")}`);
    showToast({
      type: "success",
      title: "Transaksi Berhasil Ditambahkan",
      description: `Nomor: ${trxNumber} dengan status ${newTrx.status}`,
    });
  };

  const approveTransaction = (id: string) => {
    // 1. RBAC Check: Only authorized roles can approve
    const authorizedRoles: UserRole[] = ["SUPER ADMIN", "KEPALA SEKOLAH", "BENDAHARA", "VERIFIKATOR"];
    if (!authorizedRoles.includes(currentUser.role)) {
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

    // 2. Status Machine Check: Block illegal transitions (e.g. CANCELLED -> APPROVED)
    if (target.status === "CANCELLED" || target.status === "PAID") {
      showToast({
        type: "warning",
        title: "Transisi Status Dilarang",
        description: `Transaksi berstatus ${target.status} tidak dapat disetujui secara langsung.`,
      });
      return;
    }

    // 3. Segregation of Duties / Self-Approval Prevention
    if (target.createdBy === currentUser.name && currentUser.role !== "SUPER ADMIN" && currentUser.role !== "KEPALA SEKOLAH") {
      showToast({
        type: "warning",
        title: "Pelanggaran Segregation of Duties",
        description: "Pembuat transaksi tidak dapat menyetujui transaksi miliknya sendiri.",
      });
      return;
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "APPROVED" } : t))
    );
    logAudit("APPROVE", "TRANSAKSI", target.trxNumber, `Menyetujui transaksi ${target.trxNumber} oleh ${currentUser.name} (${currentUser.role})`);
    showToast({
      type: "success",
      title: "Transaksi Disetujui",
      description: `${target.trxNumber} berhasil diverifikasi dan disetujui untuk proses pembayaran.`,
    });
  };

  const addInvoice = (inv: Omit<Invoice, "id" | "createdBy">) => {
    const id = "inv-" + Date.now();
    const newInvoice: Invoice = {
      ...inv,
      id,
      createdBy: currentUser.name,
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
    const bupotNumber = `BP-${bupot.taxType}-2026-09-${String(bupotList.length + 1).padStart(4, "0")}`;
    const newBupot: WithholdingSlip = {
      ...bupot,
      id,
      bupotNumber,
      createdBy: currentUser.name,
      dateCreated: new Date().toISOString().split("T")[0],
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

  const recordPayment = (id: string, ntpn: string, channel: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "PAID",
              ntpn,
              paymentChannel: channel,
              paymentDate: new Date().toISOString().split("T")[0],
            }
          : p
      )
    );
    const target = payments.find((p) => p.id === id);
    logAudit("PAYMENT", "PEMBAYARAN", target?.billingCode || id, `Penyetoran pajak lunas dengan NTPN ${ntpn}`);
    showToast({
      type: "success",
      title: "Penyetoran Pajak Berhasil Divalidasi",
      description: `Billing ${target?.billingCode} telah lunas dengan NTPN: ${ntpn}`,
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
    logAudit("CREATE", "EFAKTUR", newRet.returnNumber, `Merekam nota retur ${newRet.type} nomor ${newRet.returnNumber}`);
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
        selectedPeriod,
        setSelectedPeriod,
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
        updateSptStatus,
        recordPayment,
        addPayment,
        addVendor,
        addBankAccount,
        setPrimaryAccount,
        updateSchoolProfile,
        markAllNotificationsRead,
        clearCacheAndReset,
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
