<?php

namespace App\Actions\Sales;

use App\ActionContracts\Sales\EditSaleActionInterface;
use App\Models\Sale;
use Illuminate\Support\Facades\Cache;

class EditSaleAction implements EditSaleActionInterface
{
    public function handle(Sale $sale, int $quantity): void
    {
        $sale->update([
            'quantity' => $quantity,
        ]);

        Cache::forget('sales');
    }
}
