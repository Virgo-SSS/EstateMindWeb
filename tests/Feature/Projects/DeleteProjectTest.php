<?php

namespace Tests\Feature\Projects;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class DeleteProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_delete_projects(): void
    {
        $project = Project::factory()->create();

        $response = $this->delete(route('projects.destroy', $project));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_delete_project(): void
    {
        Cache::shouldReceive('forget')
            ->once()
            ->with('projects');

        Cache::shouldReceive('forget')
            ->once()
            ->with('sales');

        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->delete(route('projects.destroy', $project));

        $response->assertRedirect(route('projects.index'));
        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Project deleted successfully.');
        $this->assertDatabaseMissing('projects', $project->toArray());
    }

    public function test_sales_will_be_deleted_when_project_is_deleted(): void
    {
        Cache::shouldReceive('forget')
        ->once()
        ->with('projects');
        
        Cache::shouldReceive('forget')
        ->once()
        ->with('sales');

        $this->nonSuperAdmin();

        $project = Project::factory()->create();
        $project->sales()->create([
            'date' => now(),
            'quantity' => 10,
        ]);

        $response = $this->delete(route('projects.destroy', $project));

        $response->assertRedirect(route('projects.index'));
        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Project deleted successfully.');
        $this->assertDatabaseMissing('projects', $project->toArray());
        $this->assertDatabaseMissing('sales', ['project_id' => $project->id]);
    }
}
