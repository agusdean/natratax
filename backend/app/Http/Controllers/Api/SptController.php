<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SptRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SptController extends Controller
{
    public function index(Request $request)
    {
        $query = SptRecord::query();
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        $spt = $query->orderBy('created_at', 'desc')->paginate(15);
        return response()->json(['success' => true, 'data' => $spt->items()]);
    }

    public function store(Request $request)
    {
        $spt = SptRecord::create([
            'tenant_id' => $request->header('X-Tenant-ID') ?? Str::uuid()->toString(),
            'tax_type' => $request->input('tax_type', 'SPT Masa Unifikasi'),
            'spt_category' => $request->input('spt_category', 'MASA'),
            'tax_period' => $request->input('tax_period', 'September 2026'),
            'period_month' => (int)$request->input('period_month', 9),
            'period_year' => (int)$request->input('period_year', 2026),
            'total_dpp' => (float)$request->input('total_dpp', 0),
            'total_tax' => (float)$request->input('total_tax', 0),
            'status' => 'KONSEP',
            'billing_code' => '92837' . rand(100000000, 999999999),
            'created_by' => $request->header('X-User-Name', 'Operator'),
        ]);

        return response()->json(['success' => true, 'data' => $spt], 201);
    }

    public function show(string $id)
    {
        $spt = SptRecord::findOrFail($id);
        return response()->json(['success' => true, 'data' => $spt]);
    }

    public function verify(string $id)
    {
        $spt = SptRecord::findOrFail($id);
        $spt->update(['status' => 'SIAP_PROSES']);
        return response()->json(['success' => true, 'message' => 'SPT terverifikasi.', 'data' => $spt]);
    }
}
