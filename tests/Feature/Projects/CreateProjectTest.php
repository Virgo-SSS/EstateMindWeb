<?php

namespace Tests\Feature\Projects;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_create_project(): void
    {
        $response = $this->post(route('projects.store'));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_create_project(): void
    {
        $this->nonSuperAdmin();

        $response = $this->post(route('projects.store'), [
            'name' => 'Project name',
        ]);

        $response->assertRedirect(route('projects.index'));
        $response->assertSessionHas('success', 'Project created successfully.');

        $this->assertDatabaseHas('projects', [
            'name' => 'Project name',
        ]);
    }

    public function test_project_name_is_required(): void
    {
        $this->nonSuperAdmin();

        $response = $this->post(route('projects.store'), [
            'name' => '',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_project_name_is_unique(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->post(route('projects.store'), [
            'name' => $project->name,
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_project_name_is_not_more_than_255_characters(): void
    {
        $this->nonSuperAdmin();

        $response = $this->post(route('projects.store'), [
            'name' => str_repeat('a', 256),
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_project_name_is_a_string(): void
    {
        $this->nonSuperAdmin();

        $response = $this->post(route('projects.store'), [
            'name' => 123,
        ]);

        $response->assertSessionHasErrors('name');
    }
}
