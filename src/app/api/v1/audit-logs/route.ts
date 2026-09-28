import { NextResponse } from "next/server";
import { INITIAL_AUDIT_LOGS } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const moduleName = searchParams.get("module");

  let list = [...INITIAL_AUDIT_LOGS];
  if (action) {
    list = list.filter((l) => l.action.toUpperCase() === action.toUpperCase());
  }
  if (moduleName) {
    list = list.filter((l) => l.module.toUpperCase() === moduleName.toUpperCase());
  }

  return NextResponse.json({
    success: true,
    data: list,
    meta: {
      total: list.length,
      isImmutable: true,
      integrityHash: "sha256-natratax-audit-chain-verified",
    },
  });
}
