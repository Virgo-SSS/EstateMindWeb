<?php

namespace App\DataTransferObjects\Sales;

use App\Models\Project;
use Carbon\Carbon;

class CreateSaleDTO
{
    public function __construct(
        public Project $project,
        public Carbon $date,
        public int $quantity,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            project: Project::query()->find($data['project_id']),
            date: Carbon::parse($data['date']),
            quantity: $data['quantity'],
        );
    }
}
