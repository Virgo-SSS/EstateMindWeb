<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PredictionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Predictions/Prediction', [
            'projects' => Cache::remember('projects', 60 * 60 * 12, function () {
                return Project::query()->get();
            }),
        ]);
    }
}
