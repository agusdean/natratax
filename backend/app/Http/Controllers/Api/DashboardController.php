<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\WithholdingSlip;
use App\Models\Payment;
use App\Models\Transaction;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->header('X-Tenant-ID');

        $totalKeluaran = Invoice::where('type', 'KELUARAN')
            ->when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
            ->sum('ppn_amount');

        $totalMasukan = Invoice::where('type', 'MASUKAN')
            ->when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
            ->sum('ppn_amount');

        $totalBupot = WithholdingSlip::when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
            ->sum('tax_withheld');

        $totalPembayaran = Payment::where('status', 'PAID')
            ->when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
            ->sum('amount');

        $pendingApprovals = Transaction::where('status', 'UNDER_REVIEW')
            ->when($tenantId, fn($q) => $q->where('tenant_id', $tenantId))
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'tenant' => 'SMK BINA PUTRA JAKARTA',
                'period' => 'September-2026',
                'summary' => [
                    'totalKeluaran' => (float)$totalKeluaran,
                    'totalMasukan' => (float)$totalMasukan,
                    'totalBupotDipotong' => (float)$totalBupot,
                    'totalPembayaran' => (float)$totalPembayaran,
                    'pendingApprovals' => $pendingApprovals,
                ]
            ]
        ]);
    }
}
