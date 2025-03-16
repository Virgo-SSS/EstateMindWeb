<?php

namespace App\ActionContracts\Sales;

use App\DataTransferObjects\Sales\CreateSaleDTO;

interface CreateSaleActionInterface
{
    public function handle(CreateSaleDTO $data): void;
}
