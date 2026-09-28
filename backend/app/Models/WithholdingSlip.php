<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WithholdingSlip extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'tenant_id',
        'bupot_number',
        'bupot_type',
        'tax_type',
        'tax_object_code',
        'object_description',
        'beneficiary_name',
        'beneficiary_npwp_nik',
        'gross_amount',
        'effective_rate',
        'tax_withheld',
        'period_month',
        'period_year',
        'status',
        'created_by',
    ];

    protected $casts = [
        'gross_amount' => 'decimal:2',
        'effective_rate' => 'decimal:2',
        'tax_withheld' => 'decimal:2',
        'period_month' => 'integer',
        'period_year' => 'integer',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
