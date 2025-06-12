<?php 

namespace App\Actions\Predictions;

use App\ActionContracts\Predictions\PredictionActionInterface;
use App\DataTransferObjects\Predictions\PredictionDTO;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PredictionAction implements PredictionActionInterface
{
    public function handle(PredictionDTO $prediction): array
    {
        $project = $prediction->project;
        $period = $prediction->period;

        // Assuming you have a Prediction model to save this data
        // Prediction::create(['project_id' => $project->id, 'period' => $period]);

        $salesData = $project->sales()->get();

        $response = Http::asJson()->post(config('app.prediction_service_url') . '/predict', [
            'sales' => $salesData->toArray(),
            'period' => $period,
        ]);

        if (!$response->successful()) {
            Log::error('Failed to retrieve sales data', [
                'project_id' => $project->id,
                'period' => $period,
                'status' => $response->status(),
            ]);

            throw new \Exception('Failed to retrieve sales data from prediction service');
        }

        $results = json_decode($response->body(), true);
        if (is_null($results)) {
            Log::error('Invalid response from prediction service', [
                'project_id' => $project->id,
                'period' => $period,
                'response' => $response->body(),
            ]);

            throw new \Exception('Invalid response from prediction service');
        }

        $predictions = collect($results['predictions'])->map(function ($prediction) {
            return [
                'month' => Carbon::parse($prediction['date'])->format('Y-m'),
                'total' => round($prediction['total']),
            ];
        });

        return $predictions->toArray();
    }
}