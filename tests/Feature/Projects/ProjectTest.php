<?php

namespace Tests\Feature\Projects;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_not_view_projects(): void
    {
        $response = $this->get(route('project.index'));

        $response->assertRedirect('/login');
    }

    public function test_user_can_view_projects(): void
    {
        $this->nonSuperAdmin();

        $response = $this->get(route('project.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Projects/Projects')
                ->has('projects')
        );
    }
}
