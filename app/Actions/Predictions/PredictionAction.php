<?php 

namespace App\Actions\Predictions;

use App\ActionContracts\Predictions\PredictionActionInterface;
use App\DataTransferObjects\Predictions\PredictionDTO;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PredictionAction implements PredictionActionInterface
{
    public function handle(PredictionDTO $prediction): array
    {
        $sales = [];
        $period = $prediction->period;
        $project = $prediction->project;

        if(!$project) {
            $sales = Sale::query()
            ->select('date', DB::raw('SUM(quantity) as quantity'))
            ->groupBy('date')
            ->get();
        } else {
            $sales = $project->sales()->get();
        }


        //  Prediction model to save this data
        // Prediction::create(['project_id' => $project->id, 'period' => $period]);
        $response = Http::asJson()->post(config('app.prediction_service_url') . '/predict', [
            'sales' => $sales->toArray(),
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
                'month' => Carbon::parse($prediction['date'])->format('F Y'),
                'total' => round($prediction['total']),
            ];
        });

        return $predictions->toArray();
    }
}