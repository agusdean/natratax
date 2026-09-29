import test from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

test("Database Migration Validation: GET /api/v1/db/init", async () => {
  const res = await fetch(`${BASE_URL}/api/v1/db/init`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.engine, "Neon Serverless PostgreSQL");
  assert.ok("configured" in data);
});

test("Database Migration Validation: POST /api/v1/db/init handles schema init gracefully", async () => {
  const res = await fetch(`${BASE_URL}/api/v1/db/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok("success" in data);
});

test("Authentication: POST /api/v1/auth/login succeeds with valid credentials", async () => {
  const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "998866000010609",
      password: "password123",
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.token.startsWith("natratax_jwt_"));
  assert.equal(data.data.user.role, "BENDAHARA");
});

test("Authorization: GET /api/v1/auth/me rejects unauthenticated request (401)", async () => {
  const res = await fetch(`${BASE_URL}/api/v1/auth/me`);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.success, false);
});

test("Authorization: GET /api/v1/auth/me accepts authenticated Bearer token", async () => {
  const token = "natratax_jwt_" + Buffer.from("bendahara@smkbinaputra.sch.id").toString("base64");
  const res = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.tenant.name, "SMK BINA PUTRA JAKARTA");
});

test("Authorization & RBAC: POST /api/v1/transactions/[id]/approve rejects unauthorized role (403)", async () => {
  const res = await fetch(`${BASE_URL}/api/v1/transactions/trx-001/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-role": "OPERATOR",
      "x-user-name": "Dewi Lestari",
    },
  });
  assert.equal(res.status, 403);
  const data = await res.json();
  assert.equal(data.success, false);
});

test("Workflow & RBAC: POST /api/v1/transactions/[id]/approve blocks self-approval (422)", async () => {
  const res = await fetch(`${BASE_URL}/api/v1/transactions/trx-001/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-role": "BENDAHARA",
      "x-user-name": "Duwi Heru Santoso",
    },
  });
  // trx-001 createdBy is Duwi Heru Santoso, so Bendahara cannot self-approve
  assert.equal(res.status, 422);
  const data = await res.json();
  assert.match(data.message, /Segregation of Duties/);
});

test("Workflow & RBAC: POST /api/v1/transactions/[id]/approve succeeds for Kepala Sekolah", async () => {
  const res = await fetch(`${BASE_URL}/api/v1/transactions/trx-001/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-role": "KEPALA SEKOLAH",
      "x-user-name": "Drs. H. Mulyadi",
    },
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.status, "APPROVED");
});

test("API Validation: POST /api/v1/payments/[id]/verify-ntpn validates NTPN length", async () => {
  const res = await fetch(`${BASE_URL}/api/v1/payments/pay-001/verify-ntpn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ntpn: "123" }), // too short
  });
  assert.equal(res.status, 422);
  const data = await res.json();
  assert.equal(data.success, false);
});

test("API Success: POST /api/v1/payments/[id]/verify-ntpn verifies valid NTPN", async () => {
  const res = await fetch(`${BASE_URL}/api/v1/payments/pay-001/verify-ntpn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ntpn: "B00199283746ABCD",
      paymentChannel: "Bank DKI - CMS BOS",
    }),
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.status, "VERIFIED");
  assert.equal(data.data.ntpn, "B00199283746ABCD");
});

test("Master APIs: GET all primary endpoints return 200 with data", async () => {
  const endpoints = [
    "/api/v1/dashboard",
    "/api/v1/transactions",
    "/api/v1/invoices",
    "/api/v1/withholding-slips",
    "/api/v1/payments",
    "/api/v1/tax-rules",
    "/api/v1/audit-logs",
    "/api/v1/service-requests",
  ];

  for (const endpoint of endpoints) {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    assert.equal(res.status, 200, `Endpoint ${endpoint} failed with status ${res.status}`);
    const data = await res.json();
    assert.equal(data.success, true, `Endpoint ${endpoint} returned success: false`);
  }
});

test("Frontend Routing: Core pages return 200 with HTML", async () => {
  const pages = [
    "/",
    "/login",
    "/dashboard",
    "/invoices",
    "/invoices/incoming",
    "/invoices/outgoing",
    "/bupot",
    "/spt",
    "/payments",
    "/ledger",
    "/layanan",
    "/management/tax-rules",
    "/management/users",
    "/management/vendors",
    "/management/audit-logs",
    "/portal/profile",
    "/portal/accounts",
    "/portal/cases",
    "/privacy",
    "/terms",
    "/security",
  ];

  for (const page of pages) {
    const res = await fetch(`${BASE_URL}${page}`);
    assert.equal(res.status, 200, `Page ${page} failed with status ${res.status}`);
    const contentType = res.headers.get("content-type") || "";
    assert.ok(contentType.includes("text/html"), `Page ${page} did not return HTML`);
  }
});

test("Security Headers: Production security headers are present", async () => {
  const res = await fetch(`${BASE_URL}/`);
  assert.equal(res.headers.get("x-frame-options"), "SAMEORIGIN");
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  assert.equal(res.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.ok(res.headers.get("permissions-policy")?.includes("camera=()"));
});
