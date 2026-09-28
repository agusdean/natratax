import { NextResponse } from "next/server";
import { INITIAL_INVOICES } from "@/lib/store";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const invoice = INITIAL_INVOICES.find(
    (i) => i.id === params.id || i.invoiceNumber === params.id || i.taxInvoiceNumber === params.id
  );

  if (!invoice) {
    return NextResponse.json(
      { success: false, message: `Faktur ${params.id} tidak ditemukan.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: invoice,
  });
}
