<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::query();
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        $payments = $query->orderBy('created_at', 'desc')->paginate(15);
        return response()->json(['success' => true, 'data' => $payments->items()]);
    }

    public function store(Request $request)
    {
        $amount = (float)$request->input('amount', 0);
        if ($amount <= 0) {
            return response()->json(['success' => false, 'message' => 'Nominal tagihan harus > 0'], 422);
        }

        $payment = Payment::create([
            'tenant_id' => $request->header('X-Tenant-ID') ?? Str::uuid()->toString(),
            'billing_code' => '82910' . rand(100000000, 999999999),
            'tax_type' => $request->input('tax_type', 'PPN'),
            'period' => $request->input('period', 'September-2026'),
            'amount' => $amount,
            'due_date' => date('Y-m-d', strtotime('+15 days')),
            'status' => 'PENDING',
            'reference_note' => $request->input('reference_note', 'Pembuatan Kode Billing Mandiri'),
        ]);

        return response()->json(['success' => true, 'data' => $payment], 201);
    }

    public function show(string $id)
    {
        $payment = Payment::findOrFail($id);
        return response()->json(['success' => true, 'data' => $payment]);
    }

    public function verifyNtpn(Request $request, string $id)
    {
        $ntpn = $request->input('ntpn');
        if (empty($ntpn) || strlen($ntpn) < 8) {
            return response()->json(['success' => false, 'message' => 'Format NTPN tidak valid.'], 422);
        }

        $payment = Payment::findOrFail($id);
        $payment->update([
            'status' => 'VERIFIED',
            'ntpn' => strtoupper(trim($ntpn)),
            'payment_date' => date('Y-m-d'),
            'payment_channel' => $request->input('payment_channel', 'Bank DKI - CMS BOS'),
        ]);

        return response()->json(['success' => true, 'message' => 'NTPN berhasil divalidasi.', 'data' => $payment]);
    }
}
