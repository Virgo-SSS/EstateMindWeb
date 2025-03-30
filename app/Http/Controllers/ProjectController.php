<?php

namespace App\Http\Controllers;

use App\Http\Requests\Projects\ProjectStoreRequest;
use App\Http\Requests\Projects\ProjectUpdateRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Projects/Projects', [
            'projects' => Cache::remember('projects', 60 * 60 * 12, function () {
                return Project::query()->get();
            }),
        ]);
    }

    public function store(ProjectStoreRequest $request): RedirectResponse
    {
        Project::query()->create(['name' => $request->name]);
        Cache::forget('projects');

        return redirect()->route('project.index')->with('success', 'Project created successfully.');
    }

    public function update(ProjectUpdateRequest $request, Project $project): RedirectResponse
    {
        $project->update(['name' => $request->name]);
        Cache::forget('projects');

        return redirect()->route('project.index')->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();
        Cache::forget('projects');

        return redirect()->route('project.index')->with('success', 'Project deleted successfully.');
    }
}
