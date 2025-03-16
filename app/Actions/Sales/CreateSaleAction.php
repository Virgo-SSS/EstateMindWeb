<?php

namespace App\Actions\Sales;

use App\ActionContracts\Sales\CreateSaleActionInterface;
use App\DataTransferObjects\Sales\CreateSaleDTO;
use App\Models\Sale;

class CreateSaleAction implements CreateSaleActionInterface
{
    public function handle(CreateSaleDTO $data): void
    {
        Sale::query()->create([
            'project_id' => $data->project->id,
            'date' => $data->date,
            'quantity' => $data->quantity,
        ]);
    }
}
