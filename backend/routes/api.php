<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\WithholdingSlipController;
use App\Http\Controllers\Api\SptController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\TaxRuleController;
use App\Http\Controllers\Api\AuditLogController;

/*
|--------------------------------------------------------------------------
| NatraTax API Routes (Version 1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

    // Protected Routes
    Route::middleware(['auth:sanctum'])->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Transactions
        Route::apiResource('transactions', TransactionController::class);
        Route::post('/transactions/{id}/submit', [TransactionController::class, 'submit']);
        Route::post('/transactions/{id}/approve', [TransactionController::class, 'approve']);
        Route::post('/transactions/{id}/reject', [TransactionController::class, 'reject']);

        // e-Faktur
        Route::apiResource('invoices', InvoiceController::class);

        // e-Bupot
        Route::apiResource('withholding-slips', WithholdingSlipController::class);

        // SPT
        Route::apiResource('spt', SptController::class);
        Route::post('/spt/{id}/verify', [SptController::class, 'verify']);

        // Payments & Billing
        Route::apiResource('payments', PaymentController::class);
        Route::post('/payments/{id}/verify-ntpn', [PaymentController::class, 'verifyNtpn']);

        // Tax Rules & Config
        Route::apiResource('tax-rules', TaxRuleController::class);

        // Audit Logs
        Route::get('/audit-logs', [AuditLogController::class, 'index']);
    });
});
