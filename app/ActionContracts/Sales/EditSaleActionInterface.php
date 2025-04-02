<?php

namespace App\ActionContracts\Sales;

use App\Models\Sale;

interface EditSaleActionInterface
{
    public function handle(Sale $sale, int $quantity): void;
}
