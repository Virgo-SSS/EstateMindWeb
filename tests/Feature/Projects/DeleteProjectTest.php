<?php

namespace Tests\Feature\Projects;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class DeleteProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_delete_projects(): void
    {
        $project = Project::factory()->create();

        $response = $this->delete(route('project.destroy', $project));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_delete_project(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->delete(route('project.destroy', $project));

        $response->assertRedirect(route('project.index'));
        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Project deleted successfully.');
        $this->assertDatabaseMissing('projects', $project->toArray());
    }
}
