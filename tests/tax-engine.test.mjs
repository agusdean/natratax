import test from "node:test";
import assert from "node:assert/strict";

// Direct deterministic test of Indonesian school tax formulas
test("PPN 11% Calculation for School Purchases", () => {
  const gross = 75000000;
  const rate = 11;
  const taxAmount = Math.round((gross * rate) / 100);
  assert.equal(taxAmount, 8250000);
});

test("PPh 21 for GTT / Honorer Teacher with NPWP", () => {
  const gross = 4500000;
  const dpp = Math.round(gross * 0.5); // 50% DPP
  const rate = 5; // 5%
  const taxAmount = Math.round((dpp * rate) / 100);
  assert.equal(dpp, 2250000);
  assert.equal(taxAmount, 112500);
});

test("PPh 21 Non-NPWP 20% Penalty Surcharge", () => {
  const gross = 4500000;
  const dpp = Math.round(gross * 0.5);
  const rateWithSurcharge = 5 * 1.2; // 6%
  const taxAmount = Math.round((dpp * rateWithSurcharge) / 100);
  assert.equal(taxAmount, 135000);
});

test("PPh 22 BOS Threshold Exemption (<= Rp 2.000.000)", () => {
  const grossSmall = 1800000;
  const isExempt = grossSmall <= 2000000;
  assert.equal(isExempt, true);

  const grossLarge = 3800000;
  const isExemptLarge = grossLarge <= 2000000;
  assert.equal(isExemptLarge, false);
  const taxAmount = Math.round((grossLarge * 1.5) / 100);
  assert.equal(taxAmount, 57000);
});

test("PPh 23 Maintenance of Computer Lab JKP", () => {
  const gross = 6200000;
  const rate = 2; // 2%
  const taxAmount = Math.round((gross * rate) / 100);
  assert.equal(taxAmount, 124000);
});

test("PPh Final 4(2) Lease of School/Foundation Facilities", () => {
  const gross = 12000000;
  const rate = 10; // 10%
  const taxAmount = Math.round((gross * rate) / 100);
  assert.equal(taxAmount, 1200000);
});
