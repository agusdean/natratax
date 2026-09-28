<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
        'tax_id',
        'address',
        'status',
    ];

    public function schools()
    {
        return $this->hasMany(School::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function withholdingSlips()
    {
        return $this->hasMany(WithholdingSlip::class);
    }

    public function sptRecords()
    {
        return $this->hasMany(SptRecord::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
