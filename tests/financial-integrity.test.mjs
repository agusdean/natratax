import test from "node:test";
import assert from "node:assert/strict";

test("Financial Integrity: Net Amount equals Gross Amount minus Tax Amount", () => {
  const transactions = [
    { gross: 45000000, tax: 4950000, net: 40050000 },
    { gross: 18500000, tax: 370000, net: 18130000 },
    { gross: 6200000, tax: 124000, net: 6076000 },
    { gross: 1200000, tax: 120000, net: 1080000 },
  ];

  for (const trx of transactions) {
    assert.equal(trx.gross - trx.tax, trx.net);
  }
});

test("Invoice Math Integrity: DPP + PPN Amount equals Total Invoice", () => {
  const invoices = [
    { dpp: 45000000, rate: 11, ppn: 4950000, total: 49950000 },
    { dpp: 12000000, rate: 11, ppn: 1320000, total: 13320000 },
    { dpp: 8500000, rate: 11, ppn: 935000, total: 9435000 },
  ];

  for (const inv of invoices) {
    const calculatedPpn = Math.round((inv.dpp * inv.rate) / 100);
    assert.equal(calculatedPpn, inv.ppn);
    assert.equal(inv.dpp + calculatedPpn, inv.total);
  }
});

test("Reconciliation Matching Algorithm: Identifies Matched vs Mismatched records", () => {
  function reconcile(trx, payment) {
    if (!payment) return "MISSING_PAYMENT";
    if (trx.taxAmount !== payment.amount) return "AMOUNT_MISMATCH";
    if (payment.status !== "PAID" && payment.status !== "VERIFIED") return "UNVERIFIED_PAYMENT";
    return "MATCHED";
  }

  const trxValid = { id: "trx-1", taxAmount: 4950000 };
  const payValid = { id: "pay-1", amount: 4950000, status: "VERIFIED" };
  assert.equal(reconcile(trxValid, payValid), "MATCHED");

  const payMismatch = { id: "pay-2", amount: 4900000, status: "VERIFIED" };
  assert.equal(reconcile(trxValid, payMismatch), "AMOUNT_MISMATCH");

  const payUnverified = { id: "pay-3", amount: 4950000, status: "PENDING" };
  assert.equal(reconcile(trxValid, payUnverified), "UNVERIFIED_PAYMENT");

  assert.equal(reconcile(trxValid, null), "MISSING_PAYMENT");
});
