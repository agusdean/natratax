import { NextResponse } from "next/server";
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_INVOICES, 
  INITIAL_BUPOT, 
  INITIAL_SPT, 
  INITIAL_PAYMENTS 
} from "@/lib/store";
import { ReconciliationItem } from "@/types";

export async function GET(request: Request) {
  try {
    const items: ReconciliationItem[] = [];

    // Reconcile Transactions vs Invoices & Bupot
    INITIAL_TRANSACTIONS.forEach((trx) => {
      let matchedAmount = 0;
      let status: ReconciliationItem["status"] = "MATCHED";
      let discrepancyType: ReconciliationItem["discrepancyType"];
      let notes = "Transaksi dan dokumen perpajakan telah cocok secara akrual.";

      if (trx.taxType === "PPN") {
        const inv = INITIAL_INVOICES.find((i) => i.sourceTransactionId === trx.id || i.counterpartyNpwp === trx.vendorNpwp);
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
          }
        }
      } else if (trx.taxAmount > 0) {
        const bp = INITIAL_BUPOT.find((b) => b.sourceTransactionId === trx.id || b.beneficiaryNpwpNik === trx.vendorNpwp);
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
        period: "September 2026",
        sourceAmount: trx.grossAmount,
        matchedAmount,
        difference: Math.abs(trx.grossAmount - matchedAmount),
        status,
        discrepancyType,
        notes,
      });
    });

    // Reconcile SPT vs Payments
    INITIAL_SPT.forEach((spt) => {
      if (spt.totalTax > 0) {
        const payment = INITIAL_PAYMENTS.find((p) => p.billingCode === spt.billingCode);
        let status: ReconciliationItem["status"] = "MATCHED";
        let notes = "Kewajiban pajak telah disetor penuh ke kas negara.";

        if (!payment) {
          status = "UNRESOLVED";
          notes = "Kode billing belum dibentuk untuk SPT Kurang Bayar ini.";
        } else if (payment.status !== "PAID" && payment.status !== "VERIFIED") {
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
          matchedAmount: (payment?.status === "PAID" || payment?.status === "VERIFIED") ? payment.amount : 0,
          difference: (payment?.status === "PAID" || payment?.status === "VERIFIED") ? 0 : spt.totalTax,
          status,
          discrepancyType: payment?.status !== "PAID" ? "PAYMENT_MISMATCH" : undefined,
          notes,
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Hasil Rekonsiliasi Otomatis Transaksi, Dokumen Pajak, SPT, dan Kas Negara",
      data: items,
      summary: {
        totalRecords: items.length,
        matched: items.filter((i) => i.status === "MATCHED").length,
        needsReview: items.filter((i) => i.status === "NEEDS_REVIEW").length,
        mismatch: items.filter((i) => i.status === "MISMATCH").length,
        unresolved: items.filter((i) => i.status === "UNRESOLVED").length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
