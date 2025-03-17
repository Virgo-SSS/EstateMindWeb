<?php

namespace App\Actions\Sales;

use App\ActionContracts\Sales\EditSaleActionInterface;
use App\DataTransferObjects\Sales\CreateSaleDTO;
use App\Models\Sale;

class EditSaleAction implements EditSaleActionInterface
{
    public function handle(Sale $sale, CreateSaleDTO $data): void
    {
        $sale->update([
            'project_id' => $data->project->id,
            'date' => $data->date->format('Y-m-d'),
            'quantity' => $data->quantity,
        ]);
    }
}
