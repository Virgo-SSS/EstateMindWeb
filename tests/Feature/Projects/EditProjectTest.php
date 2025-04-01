<?php

namespace Tests\Feature\Projects;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

        $response->assertSessionHasErrors('name');
    }

    public function test_project_name_must_be_string(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->put(route('projects.update', $project), [
            'name' => 123,
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_project_name_must_be_max_255_characters(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->put(route('projects.update', $project), [
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_project_name_must_be_unique(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();
        $project2 = Project::factory()->create();

        $response = $this->put(route('projects.update', $project), [
            'name' => $project2->name,
        ]);

        $response->assertSessionHasErrors('name');
    }
}
