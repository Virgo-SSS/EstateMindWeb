<?php

namespace Tests\Feature\Users;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class DeleteUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_delete_user(): void
    {
        $user = User::factory()->create();

        $response = $this->delete(route('users.destroy', $user->id));

        $response->assertRedirect(route('login'));
    }

    public function test_non_super_admin_cannot_delete_user(): void
    {
        $this->nonSuperAdmin();

        $user = User::factory()->create();

        $response = $this->delete(route('users.destroy', $user->id));

        $response->assertStatus(403);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
        ]);
    }

    public function test_super_admin_can_delete_admin(): void
    {
        Cache::shouldReceive('forget')->once()->with('users');

        $this->superAdmin();

        $user = User::factory()->create(['role' => UserRole::ADMIN]);

        $response = $this->delete(route('users.destroy', $user->id));

        $response->assertRedirect(route('users.index'));
        $response->assertSessionHas('success', 'User deleted successfully.');
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    public function test_super_admin_user_cannot_be_deleted(): void
    {
        $this->superAdmin();

        $user = User::factory()->create(['role' => UserRole::SUPER_ADMIN]);

        $response = $this->delete(route('users.destroy', $user->id));

        $response->assertRedirect(route('users.index'));
        $response->assertSessionHasErrors(['role' => 'You can not delete super admin.']);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
        ]);
    }
}
