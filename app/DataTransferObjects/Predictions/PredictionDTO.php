<?php 

namespace App\DataTransferObjects\Predictions;

use App\Models\Project;

class PredictionDTO
{
    public function __construct(
        public Project $project,
        public int $period,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            project: Project::query()->find($data['project']),
            period: $data['period'],
        );
    }
}