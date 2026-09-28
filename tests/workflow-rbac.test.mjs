import test from "node:test";
import assert from "node:assert/strict";

// Workflow & RBAC validation simulation
const AUTHORIZED_APPROVERS = ["SUPER ADMIN", "KEPALA SEKOLAH", "BENDAHARA", "VERIFIKATOR"];

function canApprove(userRole, creatorName, approverName, currentStatus) {
  // 1. RBAC Check
  if (!AUTHORIZED_APPROVERS.includes(userRole)) {
    return { allowed: false, error: "ROLE_UNAUTHORIZED" };
  }

  // 2. Status Machine Check: Block illegal transitions
  const validInitialStatuses = ["DRAFT", "UNDER_REVIEW", "REVISION_REQUIRED"];
  if (!validInitialStatuses.includes(currentStatus)) {
    return { allowed: false, error: `ILLEGAL_TRANSITION_FROM_${currentStatus}` };
  }

  // 3. Self-approval block
  if (creatorName === approverName && userRole !== "SUPER ADMIN" && userRole !== "KEPALA SEKOLAH") {
    return { allowed: false, error: "SELF_APPROVAL_VIOLATION" };
  }

  return { allowed: true, nextStatus: "APPROVED" };
}

test("RBAC: Authorized roles can approve", () => {
  for (const role of AUTHORIZED_APPROVERS) {
    const res = canApprove(role, "Dewi Lestari", "Duwi Heru", "UNDER_REVIEW");
    assert.equal(res.allowed, true);
    assert.equal(res.nextStatus, "APPROVED");
  }
});

test("RBAC: Operator and Auditor cannot approve", () => {
  const operatorRes = canApprove("OPERATOR", "Dewi Lestari", "Dewi Lestari", "UNDER_REVIEW");
  assert.equal(operatorRes.allowed, false);
  assert.equal(operatorRes.error, "ROLE_UNAUTHORIZED");

  const auditorRes = canApprove("AUDITOR", "Dewi Lestari", "Drs. Fauzan", "UNDER_REVIEW");
  assert.equal(auditorRes.allowed, false);
  assert.equal(auditorRes.error, "ROLE_UNAUTHORIZED");
});

test("Segregation of Duties: Operator or Bendahara cannot self-approve own transaction", () => {
  const res = canApprove("BENDAHARA", "Duwi Heru Santoso", "Duwi Heru Santoso", "UNDER_REVIEW");
  assert.equal(res.allowed, false);
  assert.equal(res.error, "SELF_APPROVAL_VIOLATION");
});

test("Workflow Status Machine: Blocks transition from CANCELLED or PAID", () => {
  const cancelledRes = canApprove("BENDAHARA", "Dewi Lestari", "Duwi Heru", "CANCELLED");
  assert.equal(cancelledRes.allowed, false);
  assert.equal(cancelledRes.error, "ILLEGAL_TRANSITION_FROM_CANCELLED");

  const paidRes = canApprove("BENDAHARA", "Dewi Lestari", "Duwi Heru", "PAID");
  assert.equal(paidRes.allowed, false);
  assert.equal(paidRes.error, "ILLEGAL_TRANSITION_FROM_PAID");
});
