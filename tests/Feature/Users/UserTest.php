<?php

namespace Tests\Feature\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_auth_user_can_access_users_page(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->get(route('users.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Users/Users')
                ->has('users')
        );
    }

    public function test_guest_can_not_access_users_page(): void
    {
        $response = $this->get(route('users.index'));

        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
    }
}
