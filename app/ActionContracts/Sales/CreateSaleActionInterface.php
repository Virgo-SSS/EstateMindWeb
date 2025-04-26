<?php

namespace App\ActionContracts\Sales;

interface CreateSaleActionInterface
{
    public function handle(array $data): void;
}
