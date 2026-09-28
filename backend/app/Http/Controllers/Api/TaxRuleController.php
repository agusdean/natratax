<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TaxRule;
use Illuminate\Http\Request;

class TaxRuleController extends Controller
{
    public function index()
    {
        $rules = TaxRule::where('is_active', true)->get();
        return response()->json(['success' => true, 'data' => $rules]);
    }

    public function show(string $id)
    {
        $rule = TaxRule::findOrFail($id);
        return response()->json(['success' => true, 'data' => $rule]);
    }

    public function update(Request $request, string $id)
    {
        $rule = TaxRule::findOrFail($id);
        $rule->update($request->only(['rate_percentage', 'effective_to', 'is_active']));
        return response()->json(['success' => true, 'data' => $rule]);
    }
}
