<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::query();
        if ($request->has('module')) {
            $query->where('module', $request->module);
        }
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }
        $logs = $query->orderBy('created_at', 'desc')->paginate(30);
        return response()->json(['success' => true, 'data' => $logs->items()]);
    }
}
