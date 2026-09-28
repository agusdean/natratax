<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\TaxCalculationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    protected $taxService;

    public function __construct(TaxCalculationService $taxService)
    {
        $this->taxService = $taxService;
    }

    public function index(Request $request)
    {
        $tenantId = $request->header('X-Tenant-ID');
        $query = Transaction::query();

        if ($tenantId) {
            $query->where('tenant_id', $tenantId);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $transactions = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $transactions->items(),
            'meta' => [
                'current_page' => $transactions->currentPage(),
                'total' => $transactions->total(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'gross_amount' => 'required|numeric|min:0',
            'tax_type' => 'required|string',
            'vendor_name' => 'required|string',
            'category_name' => 'required|string',
            'type' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $calc = $this->taxService->calculate(
            $request->tax_type,
            (float)$request->gross_amount,
            $request->boolean('has_npwp', true),
            $request->date ?? date('Y-m-d')
        );

        $transaction = Transaction::create([
            'tenant_id' => $request->header('X-Tenant-ID') ?? Str::uuid()->toString(),
            'trx_number' => 'TRX-BP-' . date('Y-m') . '-' . rand(100, 999),
            'date' => $request->date ?? date('Y-m-d'),
            'type' => $request->type,
            'category_name' => $request->category_name,
            'vendor_name' => $request->vendor_name,
            'vendor_npwp' => $request->vendor_npwp ?? '01.000.000.0-000.000',
            'description' => $request->description,
            'gross_amount' => $calc['gross_amount'],
            'tax_type' => $calc['tax_type'],
            'tax_base' => $calc['tax_base'],
            'tax_rate' => $calc['effective_rate'],
            'tax_amount' => $calc['tax_amount'],
            'net_amount' => $calc['net_amount'],
            'status' => 'UNDER_REVIEW',
            'created_by' => $request->header('X-User-Name', 'Operator'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dicatat dan diajukan verifikasi',
            'data' => $transaction
        ], 201);
    }

    public function show(string $id)
    {
        $transaction = Transaction::findOrFail($id);
        return response()->json(['success' => true, 'data' => $transaction]);
    }

    public function submit(string $id)
    {
        $transaction = Transaction::findOrFail($id);
        if ($transaction->status !== 'DRAFT' && $transaction->status !== 'REVISION_REQUIRED') {
            return response()->json(['success' => false, 'message' => 'Status tidak valid untuk submit.'], 422);
        }
        $transaction->update(['status' => 'UNDER_REVIEW']);
        return response()->json(['success' => true, 'message' => 'Transaksi diajukan.', 'data' => $transaction]);
    }

    public function approve(Request $request, string $id)
    {
        $role = $request->header('X-User-Role', 'BENDAHARA');
        $authorized = ['SUPER ADMIN', 'KEPALA SEKOLAH', 'BENDAHARA', 'VERIFIKATOR'];
        if (!in_array($role, $authorized)) {
            return response()->json(['success' => false, 'message' => 'Peran tidak berhak menyetujui.'], 403);
        }

        $transaction = Transaction::findOrFail($id);
        $transaction->update(['status' => 'APPROVED']);
        return response()->json(['success' => true, 'message' => 'Transaksi disetujui.', 'data' => $transaction]);
    }

    public function reject(Request $request, string $id)
    {
        $transaction = Transaction::findOrFail($id);
        $transaction->update(['status' => 'REVISION_REQUIRED']);
        return response()->json(['success' => true, 'message' => 'Transaksi dikembalikan untuk revisi.', 'data' => $transaction]);
    }
}
