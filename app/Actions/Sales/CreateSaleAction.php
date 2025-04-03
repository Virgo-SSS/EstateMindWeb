<?php

namespace App\Actions\Sales;

use App\ActionContracts\Sales\CreateSaleActionInterface;
use App\DataTransferObjects\Sales\CreateSaleDTO;
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
        $projectNames = collect($data['sales'])->pluck('project')->unique();

        $existingProjects = Project::query()->whereIn('name', $projectNames)
            ->pluck('id', 'name')
            ->toArray();

        $this->identifyMissingProjects($projectNames, $existingProjects);

        // Prepare sales data for bulk insert/update
        $salesData = $this->prepareSalesData($data, $existingProjects);
        $this->insertSales($salesData);

        Cache::forget('sales');
    }

    private function insertSales(array $salesData): void
    {
        DB::transaction(function () use ($salesData) {
            foreach ($salesData as $sale) {
                Sale::query()->updateOrCreate(
                    ['project_id' => $sale['project_id'], 'date' => $sale['date']],
                    ['quantity' => $sale['quantity']]
                );
            }
        });
    }

    private function prepareSalesData(array $data, array $existingProjects): array
    {
        return collect($data['sales'])->map(function ($sale) use ($existingProjects) {
            return [
                'project_id' => $existingProjects[$sale['project']],
                'date' => Carbon::parse($sale['date']),
                'quantity' => $sale['quantity'],
                'updated_at' => now(),
                'created_at' => now(),
            ];
        })->toArray();
    }

    /**
     * @throws \Exception
     */
    private function identifyMissingProjects(Collection $projectNames, array $existingProjects): void
    {
        // Identify missing projects
        $missingProjects = $projectNames->diff(array_keys($existingProjects));

        if ($missingProjects->isNotEmpty()) {
            throw new \Exception('Project(s) name is not found: ' . implode(', ', $missingProjects->toArray()) . '. Please create them first or check the spelling.');
        }
    }
}
