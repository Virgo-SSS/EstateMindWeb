<?php

namespace App\Actions\Sales;

use App\ActionContracts\Sales\CreateSaleActionInterface;
use App\DataTransferObjects\Sales\CreateSaleDTO;
use App\Models\Sale;
use Illuminate\Support\Facades\Cache;

class CreateSaleAction implements CreateSaleActionInterface
{
    public function handle(CreateSaleDTO $data): void
    {
        Sale::query()->create([
            'project_id' => $data->project->id,
            'date' => $data->date->format('Y-m-d'),
            'quantity' => $data->quantity,
        ]);

        Cache::forget('sales');
    }
}
