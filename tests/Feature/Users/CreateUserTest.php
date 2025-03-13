<?php

namespace Tests\Feature\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CreateUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_access_create_user_page(): void
    {
        $superAdmin = User::factory()->create(['is_super_admin' => true]);

        $this->actingAs($superAdmin);

        $response = $this->get(route('users.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Users/CreateUser'));
    }

    public function test_non_super_admin_cannot_access_create_user_page(): void
    {
        $user = User::factory()->create(['is_super_admin' => false]);

        $this->actingAs($user);

        $response = $this->get(route('users.create'));

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_create_user_page(): void
    {
        $response = $this->get(route('users.create'));

        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
    }
}
