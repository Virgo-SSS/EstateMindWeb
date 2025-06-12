<?php 

namespace App\ActionContracts\Predictions;

use App\DataTransferObjects\Predictions\PredictionDTO;

interface PredictionActionInterface
{
    public function handle(PredictionDTO $prediction): array;
}