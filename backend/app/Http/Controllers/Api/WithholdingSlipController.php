<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WithholdingSlip;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WithholdingSlipController extends Controller
{
    public function index(Request $request)
    {
        $query = WithholdingSlip::query();
        if ($request->has('tax_type')) {
            $query->where('tax_type', $request->tax_type);
        }
        $slips = $query->orderBy('created_at', 'desc')->paginate(15);
        return response()->json(['success' => true, 'data' => $slips->items()]);
    }

    public function store(Request $request)
    {
        $taxType = $request->input('tax_type', 'PPH21');
        $gross = (float)$request->input('gross_amount', 0);
        $rate = (float)$request->input('effective_rate', 5.0);
        $dpp = $taxType === 'PPH21' ? round($gross * 0.5) : $gross;
        $taxWithheld = round(($dpp * $rate) / 100);

        $slip = WithholdingSlip::create([
            'tenant_id' => $request->header('X-Tenant-ID') ?? Str::uuid()->toString(),
            'bupot_number' => 'BP-' . $taxType . '-2026-09-' . rand(1000, 9999),
            'bupot_type' => $request->input('bupot_type', 'BP21'),
            'tax_type' => $taxType,
            'tax_object_code' => $request->input('tax_object_code', '21-100-01'),
            'object_description' => $request->input('object_description', 'Honorarium Guru Tidak Tetap'),
            'beneficiary_name' => $request->input('beneficiary_name', 'Penerima Penghasilan'),
            'beneficiary_npwp_nik' => $request->input('beneficiary_npwp_nik', '3171000000000001'),
            'gross_amount' => $gross,
            'effective_rate' => $rate,
            'tax_withheld' => $taxWithheld,
            'period_month' => (int)$request->input('period_month', 9),
            'period_year' => (int)$request->input('period_year', 2026),
            'status' => 'TERBIT',
            'created_by' => $request->header('X-User-Name', 'Operator'),
        ]);

        return response()->json(['success' => true, 'data' => $slip], 201);
    }

    public function show(string $id)
    {
        $slip = WithholdingSlip::findOrFail($id);
        return response()->json(['success' => true, 'data' => $slip]);
    }
}
