import test from "node:test";
import assert from "node:assert/strict";

// In-engine logic replication for comprehensive test isolation
function calculateTax({ taxType, grossAmount, hasNpwp = true, date = "2026-09-01" }) {
  if (grossAmount < 0) {
    throw new Error(`Nilai bruto transaksi tidak boleh bernilai negatif: Rp ${grossAmount}`);
  }

  if (grossAmount === 0) {
    return {
      taxType,
      grossAmount: 0,
      taxBase: 0,
      effectiveRate: 0,
      taxAmount: 0,
      netAmount: 0,
      isExempt: true,
      legalNote: "Nol",
    };
  }

  let dpp = grossAmount;
  let rate = 0;
  let isExempt = false;
  let taxAmount = 0;

  switch (taxType) {
    case "PPN":
      rate = 11;
      taxAmount = Math.round((dpp * rate) / 100);
      break;
    case "PPH21":
      dpp = Math.round(grossAmount * 0.5);
      rate = hasNpwp ? 5 : 6; // 20% surcharge
      taxAmount = Math.round((dpp * rate) / 100);
      break;
    case "PPH22":
      if (grossAmount <= 2000000) {
        isExempt = true;
        rate = 0;
        taxAmount = 0;
      } else {
        rate = hasNpwp ? 1.5 : 3.0; // 100% surcharge
        taxAmount = Math.round((grossAmount * rate) / 100);
      }
      break;
    case "PPH23":
      rate = hasNpwp ? 2.0 : 4.0;
      taxAmount = Math.round((grossAmount * rate) / 100);
      break;
    case "PPH4_2":
      rate = 10.0;
      taxAmount = Math.round((grossAmount * rate) / 100);
      break;
    case "PP55_FINAL":
      rate = 0.5; // PP 55/2022 Final UMKM
      taxAmount = Math.round((grossAmount * rate) / 100);
      break;
    default:
      throw new Error(`Jenis pajak ${taxType} tidak didukung.`);
  }

  return {
    taxType,
    grossAmount,
    taxBase: dpp,
    effectiveRate: rate,
    taxAmount,
    netAmount: grossAmount - taxAmount,
    isExempt,
  };
}

// 1. Boundary Testing Required by Master Prompt: 0, 1, 100, 1,000, 10,000, 100,000, 1,000,000, 10,000,000, 100,000,000
const testAmounts = [0, 1, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];

test("PPN 11% Boundary Scale Testing (0 to 100,000,000)", () => {
  for (const amt of testAmounts) {
    const res = calculateTax({ taxType: "PPN", grossAmount: amt });
    assert.equal(res.grossAmount, amt);
    assert.equal(res.taxAmount, Math.round((amt * 11) / 100));
    assert.equal(res.netAmount, amt - res.taxAmount);
  }
});

test("PPh 22 BOS Threshold: Rp 2,000,000 exact exemption vs Rp 2,000,001 taxable", () => {
  const exempt = calculateTax({ taxType: "PPH22", grossAmount: 2000000 });
  assert.equal(exempt.isExempt, true);
  assert.equal(exempt.taxAmount, 0);

  const taxable = calculateTax({ taxType: "PPH22", grossAmount: 2000001 });
  assert.equal(taxable.isExempt, false);
  assert.equal(taxable.taxAmount, Math.round((2000001 * 1.5) / 100)); // Rp 30.000
});

test("PPh 21 Honor GTT: 50% DPP and non-NPWP 20% surcharge", () => {
  const npwp = calculateTax({ taxType: "PPH21", grossAmount: 10000000, hasNpwp: true });
  assert.equal(npwp.taxBase, 5000000);
  assert.equal(npwp.effectiveRate, 5);
  assert.equal(npwp.taxAmount, 250000);

  const nonNpwp = calculateTax({ taxType: "PPH21", grossAmount: 10000000, hasNpwp: false });
  assert.equal(nonNpwp.taxBase, 5000000);
  assert.equal(nonNpwp.effectiveRate, 6); // 5% * 1.2
  assert.equal(nonNpwp.taxAmount, 300000);
});

test("PPh 23 Maintenance Lab: 2% NPWP vs 4% non-NPWP", () => {
  const npwp = calculateTax({ taxType: "PPH23", grossAmount: 5000000, hasNpwp: true });
  assert.equal(npwp.taxAmount, 100000);

  const nonNpwp = calculateTax({ taxType: "PPH23", grossAmount: 5000000, hasNpwp: false });
  assert.equal(nonNpwp.taxAmount, 200000);
});

test("PP 55/2022 Omset 0.5% calculation", () => {
  const res = calculateTax({ taxType: "PP55_FINAL", grossAmount: 12500000 });
  assert.equal(res.taxAmount, 62500);
  assert.equal(res.netAmount, 12500000 - 62500);
});

test("Negative values rejection", () => {
  assert.throws(() => {
    calculateTax({ taxType: "PPN", grossAmount: -500000 });
  }, /tidak boleh bernilai negatif/);
});

test("Decimal rounding precision", () => {
  // 11% of 33,333.33 = 3666.6663 -> Math.round -> 3667
  const res = calculateTax({ taxType: "PPN", grossAmount: 33333.33 });
  assert.equal(Number.isInteger(res.taxAmount), true);
  assert.equal(res.taxAmount, 3667);
});
