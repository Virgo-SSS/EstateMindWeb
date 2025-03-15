<?php

namespace App\Http\Controllers;

use App\Http\Requests\Projects\ProjectStoreRequest;
use App\Http\Requests\Projects\ProjectUpdateRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Projects/Projects', [
            'projects' => Project::query()->get()
        ]);
    }

    public function store(ProjectStoreRequest $request): RedirectResponse
    {
        Project::query()->create(['name' => $request->name]);

        return redirect()->route('project.index')->with('success', 'Project created successfully.');
    }

    public function update(ProjectUpdateRequest $request, Project $project): RedirectResponse
    {
        $project->update(['name' => $request->name]);

        return redirect()->route('project.index')->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()->route('project.index')->with('success', 'Project deleted successfully.');
    }
}
