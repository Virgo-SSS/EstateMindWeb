<?php

namespace App\Actions\Sales;

use App\ActionContracts\Sales\CreateSaleActionInterface;
use App\Models\Project;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CreateSaleAction implements CreateSaleActionInterface
{
    /**
     * @throws \Exception
     */
    public function handle(array $data): void
    {
        $projects = collect($data['sales'])->pluck('project')->unique();

        $existingProjects = Project::query()->whereIn('id', $projects)
            ->pluck('id')
            ->toArray();

        $this->identifyMissingProjects($projects, $existingProjects);

        // Prepare sales data for bulk insert/update
        $salesData = $this->prepareSalesData($data);
        $this->insertSales($salesData);

        Cache::forget('sales');
    }

    private function insertSales(array $salesData): void
    {
        DB::transaction(function () use ($salesData) {
            foreach ($salesData as $sale) {
                Sale::query()->updateOrCreate(
                    [
                        'project_id' => $sale['project_id'],
                        'date' => $sale['date']
                    ],
                    [
                        'quantity' => $sale['quantity']
                    ]
                );
            }
        });
    }

    private function prepareSalesData(array $data): array
    {
        return collect($data['sales'])->map(function (array $sale) {
            return [
                'project_id' => $sale['project'],
                'date' => Carbon::parse($sale['date']),
                'quantity' => $sale['quantity'],
            ];
        })->toArray();
    }

    /**
     * @throws \Exception
     */
    private function identifyMissingProjects(Collection $projects, array $existingProjects): void
    {
        // Identify missing projects
        $missingProjects = $projects->diff($existingProjects);

        if ($missingProjects->isNotEmpty()) {
            throw new \Exception('Project(s) with Ids: ' . implode(', ', $missingProjects->toArray()) . ' is not found. Please create them first or check the spelling.');
        }
    }
}
