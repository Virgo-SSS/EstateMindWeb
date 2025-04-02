<?php

namespace Tests\Feature\Projects;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_not_view_projects(): void
    {
        $response = $this->get(route('projects.index'));

        $response->assertRedirect('/login');
    }

    public function test_user_can_view_projects(): void
    {
        Cache::shouldReceive('remember')
            ->once()
            ->with('projects', 60 * 60 * 12, \Closure::class)
            ->andReturn(collect());

        $this->nonSuperAdmin();

        $response = $this->get(route('projects.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Projects/Projects')
                ->has('projects')
        );
    }
}
