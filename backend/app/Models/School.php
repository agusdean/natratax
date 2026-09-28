<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'tenant_id',
        'name',
        'npsn',
        'tax_id',
        'treasurer_name',
        'principal_name',
        'bank_name',
        'bank_account_number',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
