<?php

namespace App\Http\Controllers;

use App\ActionContracts\Predictions\PredictionActionInterface;
use App\DataTransferObjects\Predictions\PredictionDTO;
use App\Http\Requests\Predictions\PredictionRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PredictionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Predictions/Prediction', [
            'projects' => Cache::get('projects', function () {
                return Project::query()->get();
            }),
            'results' => [
                'predictedHouse' => session('predictedHouse', []),
            ],
        ]);
    }

    public function predict(PredictionRequest $request, PredictionActionInterface $action): RedirectResponse
    {
        $results = $action->handle(PredictionDTO::fromArray(
            $request->validated()
        ));

        return redirect()
            ->back()
            ->with([
                'predictedHouse' => $results,
            ]);
    }
}
