<?php

namespace Tests\Feature\Users;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_access_users_page(): void
    {
        Cache::shouldReceive('remember')
            ->once()
            ->with('users', 12 * 60 * 60, \Closure::class)
            ->andReturn(collect());

        $this->superAdmin();

        $response = $this->get(route('users.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Users/Users')
                ->has('users')
        );
    }

    public function test_non_super_admin_cannot_access_users_page(): void
    {
        $this->nonSuperAdmin();

        $response = $this->get(route('users.index'));

        $response->assertStatus(403);
    }

    public function test_guest_can_not_access_users_page(): void
    {
        $response = $this->get(route('users.index'));

        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
    }
}
