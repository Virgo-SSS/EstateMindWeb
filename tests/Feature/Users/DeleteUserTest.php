<?php

namespace Tests\Feature\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeleteUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_be_deleted(): void
    {
        $this->superAdmin();

        $user = User::factory()->create();

        $response = $this->delete(route('users.destroy', $user->id));

        $response->assertRedirect(route('users.index'));
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    public function test_a_user_can_not_be_deleted_by_non_super_admin(): void
    {
        $this->nonSuperAdmin();

        $user = User::factory()->create();

        $response = $this->delete(route('users.destroy', $user->id));

        $response->assertStatus(403);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
        ]);
    }

    public function test_a_user_can_not_be_deleted_by_non_authenticated_user(): void
    {
        $user = User::factory()->create();

        $response = $this->delete(route('users.destroy', $user->id));

        $response->assertRedirect(route('login'));
    }
}
