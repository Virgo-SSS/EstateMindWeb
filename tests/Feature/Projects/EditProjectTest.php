<?php

namespace Tests\Feature\Projects;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class EditProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_edit_project(): void
    {
        $project = Project::factory()->create();

        $response = $this->put(route('projects.update', $project));

        $response->assertRedirect(route('login'));
    }

    public function test_auth_user_can_edit_project(): void
    {
        Cache::shouldReceive('forget')
        ->once()
        ->with('projects');

        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->put(route('projects.update', $project), [
            'name' => 'New Project Name',
        ]);

        $response->assertRedirect(route('projects.index'));
        $response->assertSessionHas('success', 'Project updated successfully.');

        $this->assertDatabaseHas('projects', [
            'name' => 'New Project Name'
        ]);

        $this->assertDatabaseMissing('projects', [
            'name' => $project->name
        ]);
    }

    public function test_project_name_is_required(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->put(route('projects.update', $project), [
            'name' => '',
        ]);

        $response->assertSessionHasErrors('name', 'The name field is required.');
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => $project->name
        ]);
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
            'name' => ''
        ]);
    }

    public function test_project_name_must_be_string(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->put(route('projects.update', $project), [
            'name' => 123,
        ]);

        $response->assertSessionHasErrors('name', 'The name must be a string.');
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => $project->name
        ]);
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
            'name' => 123
        ]);
    }

    public function test_project_name_must_be_max_255_characters(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->put(route('projects.update', $project), [
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors('name', 'The name must not be greater than 255 characters.');
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => $project->name
        ]);
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
            'name' => str_repeat('a', 256)
        ]);
    }

    public function test_project_name_must_be_unique(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();
        $project2 = Project::factory()->create();

        $response = $this->put(route('projects.update', $project), [
            'name' => $project2->name,
        ]);

        $response->assertSessionHasErrors('name', 'The name has already been taken.');
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => $project->name
        ]);
        $this->assertDatabaseHas('projects', [
            'id' => $project2->id,
            'name' => $project2->name
        ]);
        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
            'name' => $project2->name
        ]);
        $this->assertDatabaseMissing('projects', [
            'id' => $project2->id,
            'name' => $project->name
        ]);
    }
}
