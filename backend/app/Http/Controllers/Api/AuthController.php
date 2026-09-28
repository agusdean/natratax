<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Otentikasi berhasil via NatraTax Sanctum',
            'data' => [
                'token' => 'natratax_sanctum_' . bin2hex(random_bytes(16)),
                'user' => [
                    'name' => 'DUWI HERU SANTOSO',
                    'email' => 'duwi.heru@binaputra.sch.id',
                    'role' => 'BENDAHARA',
                    'tax_id' => '9988770000010609',
                    'school' => 'SMK BINA PUTRA JAKARTA',
                ]
            ]
        ]);
    }

    public function logout(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Berhasil logout'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $request->user() ?? [
                    'name' => 'DUWI HERU SANTOSO',
                    'email' => 'duwi.heru@binaputra.sch.id',
                    'role' => 'BENDAHARA',
                    'tax_id' => '9988770000010609',
                    'school' => 'SMK BINA PUTRA JAKARTA',
                ]
            ]
        ]);
    }
}
