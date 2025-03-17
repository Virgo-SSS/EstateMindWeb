<?php

namespace App\ActionContracts\Sales;

use App\DataTransferObjects\Sales\CreateSaleDTO;
use App\Models\Sale;

interface EditSaleActionInterface
{
    public function handle(Sale $sale, CreateSaleDTO $data): void;
}
