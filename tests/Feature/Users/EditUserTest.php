<?php

namespace Tests\Feature\Users;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class EditUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_display_the_edit_user_page(): void
    {
        $this->superAdmin();

        $user = User::factory()->create();

        $response = $this->get(route('users.edit', $user));

        $response->assertInertia(
            fn (AssertableInertia $page) => $page
            ->component('Users/EditUser')
            ->has('user')
        );

        $response->assertStatus(200);
    }

    public function test_guest_cannot_access_edit_user_page(): void
    {
        $user = User::factory()->create();

        $response = $this->get(route('users.edit', $user));

        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
    }

    public function test_non_super_admin_cannot_access_edit_user_page(): void
    {
        $user = $this->nonSuperAdmin();

        $response = $this->get(route('users.edit', $user));

        $response->assertStatus(403);
    }

    public function test_guest_cannot_update_user(): void
    {
        $user = User::factory()->create();

        $response = $this->put(route('users.update', $user), [
            'name' => 'John Doe',
            'email' => 'asdf@gmail.com',
            'role' => UserRole::SUPER_ADMIN->value,
        ]);

        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
        $this->assertDatabaseMissing('users', [
            'name' => 'John Doe',
            'email' => 'asdf@gmail.com',
            'role' => UserRole::SUPER_ADMIN->value,
        ]);
    }

    public function test_non_super_admin_cannot_update_user(): void
    {
        $user = $this->nonSuperAdmin();

        $response = $this->put(route('users.update', $user), [
            'name' => 'John Doe',
            'email' => 'asdfasdf@gmail.com',
            'role' => UserRole::SUPER_ADMIN->value,
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('users', [
            'name' => 'John Doe',
            'email' => 'asdfasdf@gmail.com',
            'role' => UserRole::SUPER_ADMIN->value,
        ]);
    }

    #[DataProvider('validationDataProvider')]
    public function test_update_user_validation_rules(string $field, mixed $value, string $validationMessage): void
    {
        $this->superAdmin();

        $userToUpdate = User::factory()->create();

        $data = [
            'name' => 'John Doe',
            'email' => 'valid@example.com',
            'password' => 'password123',
            'role' => UserRole::SUPER_ADMIN->value,
        ];

        $data[$field] = $value;

        $response = $this->put(route('users.update', $userToUpdate), $data);

        $response->assertSessionHasErrors([$field => $validationMessage]);
    }

    public static function validationDataProvider(): array
    {
        return [
            'name is required' => ['name', '', 'The name field is required.'],
            'name must be string' => ['name', 123, 'The name field must be a string.'],
            'name max length' => ['name', str_repeat('a', 256), 'The name field must not be greater than 255 characters.'],

            'email is required' => ['email', '', 'The email field is required.'],
            'email must be string' => ['email', 123, 'The email field must be a string.'],
            'email must be valid format' => ['email', 'invalid-email', 'The email field must be a valid email address.'],

            'password min length' => ['password', 'short', 'The password field must be at least 8 characters.'],

            'role is required' => ['role', null, 'The role field is required.'],
            'role must be integer' => ['role', 'string', 'The role field must be an integer.'],
            'role must be valid enum' => ['role', 999999, 'The selected role is invalid.'],
        ];
    }

    public function test_email_unique_validation_allows_same_user_email(): void
    {
        Cache::shouldReceive('forget')
        ->once()
        ->with('users');

        $this->superAdmin();

        $userToUpdate = User::factory()->create();

        $data = [
            'name' => 'John Doe',
            'email' => $userToUpdate->email, // Using the same email
            'password' => 'password123',
            'role' => UserRole::SUPER_ADMIN->value,
        ];

        $response = $this->put(route('users.update', $userToUpdate), $data);

        $response->assertRedirect(route('users.index'));
        $response->assertStatus(302);
        $response->assertSessionHas('success', 'User updated successfully.');
        $response->assertSessionDoesntHaveErrors('email');
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => $userToUpdate->email,
            'role' => UserRole::SUPER_ADMIN->value,
        ]);
        $this->assertDatabaseMissing('users', [
            'name' => $userToUpdate->name,
            'email' => $userToUpdate->email,
            'role' => $userToUpdate->role,
        ]);
    }

    public function test_email_unique_validation_prevents_duplicate_email(): void
    {
        $this->superAdmin();

        $userToUpdate = User::factory()->create();

        // Create another user with a specific email
        User::factory()->create(['email' => 'taken@example.com']);

        $data = [
            'name' => 'John Doe',
            'email' => 'taken@example.com', // Using another user's email
            'password' => 'password123',
            'role' => UserRole::SUPER_ADMIN->value,
        ];

        $response = $this->put(route('users.update', $userToUpdate), $data);

        $response->assertSessionHasErrors('email');
        $response->assertInvalid(['email' => "The email has already been taken."]);
        $this->assertDatabaseMissing('users', [
            'name' => 'John Doe',
            'email' => 'taken@example.com',
            'role' => UserRole::SUPER_ADMIN->value,
        ]);
        $this->assertDatabaseHas('users', [
            'name' => $userToUpdate->name,
            'email' => $userToUpdate->email,
            'role' => $userToUpdate->role,
        ]);
    }

    public function test_password_field_is_optional(): void
    {
        Cache::shouldReceive('forget')
            ->once()
            ->with('users');

        $this->superAdmin();

        $userToUpdate = User::factory()->create();

        $data = [
            'name' => 'John Doe',
            'email' => 'valid@example.com',
            'role' => UserRole::SUPER_ADMIN->value,
        ];

        $response = $this->put(route('users.update', $userToUpdate), $data);

        $response->assertSessionDoesntHaveErrors('password');
        $response->assertSessionHas('success', 'User updated successfully.');
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'valid@example.com',
            'role' => UserRole::SUPER_ADMIN->value,
        ]);
    }

    public function test_super_admin_can_update_user(): void
    {
        Cache::shouldReceive('forget')
            ->once()
            ->with('users');

        $this->superAdmin();

        $user = User::factory()->create();

        $response = $this->put(route('users.update', $user), [
            'name' => 'John Doe',
            'email' => 'changeemail@gmail.com',
            'role' => UserRole::SUPER_ADMIN->value,
            'password' => 'changepassword123',
        ]);

        $response->assertRedirect(route('users.index'));
        $response->assertStatus(302);
        $response->assertSessionHas('success', 'User updated successfully.');
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'changeemail@gmail.com',
            'role' => UserRole::SUPER_ADMIN->value,
        ]);
        $this->assertDatabaseMissing('users', [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ]);
    }
}
