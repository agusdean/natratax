<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Invoice::query();
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        $invoices = $query->orderBy('created_at', 'desc')->paginate(15);
        return response()->json(['success' => true, 'data' => $invoices->items()]);
    }

    public function store(Request $request)
    {
        $dpp = (float)$request->input('dpp', 0);
        $rate = (float)$request->input('ppn_rate', 11.0);
        $ppnAmount = round(($dpp * $rate) / 100);

        $invoice = Invoice::create([
            'tenant_id' => $request->header('X-Tenant-ID') ?? Str::uuid()->toString(),
            'transaction_id' => $request->transaction_id,
            'invoice_number' => 'INV/BP/' . date('Y/m') . '/' . rand(100, 999),
            'tax_invoice_number' => '010.000-26.' . rand(10000000, 99999999),
            'type' => $request->input('type', 'KELUARAN'),
            'date' => $request->input('date', date('Y-m-d')),
            'counterparty_name' => $request->input('counterparty_name', 'Rekanan Sekolah'),
            'counterparty_npwp' => $request->input('counterparty_npwp', '01.000.000.0-000.000'),
            'dpp' => $dpp,
            'ppn_rate' => $rate,
            'ppn_amount' => $ppnAmount,
            'total' => $dpp + $ppnAmount,
            'status' => 'TERBIT',
            'period' => $request->input('period', date('m-Y')),
            'created_by' => $request->header('X-User-Name', 'Operator'),
        ]);

        return response()->json(['success' => true, 'data' => $invoice], 201);
    }

    public function show(string $id)
    {
        $invoice = Invoice::findOrFail($id);
        return response()->json(['success' => true, 'data' => $invoice]);
    }

    public function destroy(string $id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->update(['status' => 'DIBATALKAN']);
        return response()->json(['success' => true, 'message' => 'Faktur dibatalkan.']);
    }
}
