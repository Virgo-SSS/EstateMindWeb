<?php

namespace Tests\Feature\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class EditUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_display_the_edit_user_page(): void
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

    public function test_it_can_update_user(): void
    {
        $this->superAdmin();

        $user = User::factory()->create();

        $response = $this->put(route('users.update', $user), [
            'name' => 'John Doe',
            'email' => 'changeemail@gmail.com',
            'is_super_admin' => true,
            'password' => 'changepassword',
        ]);

        $response->assertRedirect(route('users.index'));
        $response->assertStatus(302);
        $response->assertSessionHas('success', 'User updated successfully.');
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'changeemail@gmail.com',
            'is_super_admin' => true,
        ]);
        $this->assertDatabaseMissing('users', [
            'name' => $user->name,
            'email' => $user->email,
            'is_super_admin' => $user->is_super_admin,
        ]);
    }

    public function test_guest_cannot_update_user(): void
    {
        $user = User::factory()->create();

        $response = $this->put(route('users.update', $user), [
            'name' => 'John Doe',
            'email' => 'asdf@gmail.com',
            'is_super_admin' => true,
        ]);

        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
        $this->assertDatabaseMissing('users', [
            'name' => 'John Doe',
            'email' => 'asdf@gmail.com',
            'is_super_admin' => true,
        ]);
    }

    public function test_non_super_admin_cannot_update_user(): void
    {
        $user = $this->nonSuperAdmin();

        $response = $this->put(route('users.update', $user), [
            'name' => 'John Doe',
            'email' => 'asdfasdf@gmail.com',
            'is_super_admin' => true,
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('users', [
            'name' => 'John Doe',
            'email' => 'asdfasdf@gmail.com',
            'is_super_admin' => true,
        ]);
    }

    #[DataProvider('validationDataProvider')]
    public function test_update_user_validation_rules(string $field, mixed $value): void
    {
        $this->superAdmin();

        $userToUpdate = User::factory()->create();

        $data = [
            'name' => 'John Doe',
            'email' => 'valid@example.com',
            'password' => 'password123',
            'is_super_admin' => true,
        ];

        $data[$field] = $value;

        $response = $this->put(route('users.update', $userToUpdate), $data);

        $response->assertSessionHasErrors($field);
    }

    public static function validationDataProvider(): array
    {
        return [
            'name is required' => ['name', '', 'required'],
            'name must be string' => ['name', 123, 'string'],
            'name max length' => ['name', str_repeat('a', 256)],

            'email is required' => ['email', '', 'required'],
            'email must be string' => ['email', 123, 'string'],
            'email must be valid format' => ['email', 'not-an-email'],

            'password min length' => ['password', 'short', 'min'],

            'is_super_admin is required' => ['is_super_admin', null],
            'is_super_admin must be boolean' => ['is_super_admin', 'not-boolean'],
        ];
    }

    public function test_email_unique_validation_allows_same_user_email(): void
    {
        $this->superAdmin();

        $userToUpdate = User::factory()->create();

        $data = [
            'name' => 'John Doe',
            'email' => $userToUpdate->email, // Using the same email
            'password' => 'password123',
            'is_super_admin' => true,
        ];

        $response = $this->put(route('users.update', $userToUpdate), $data);

        $response->assertSessionDoesntHaveErrors('email');
        $response->assertSessionHas('success');
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
            'is_super_admin' => true,
        ];

        $response = $this->put(route('users.update', $userToUpdate), $data);

        $response->assertSessionHasErrors('email');
        $response->assertInvalid(['email' => "The email has already been taken."]);
    }

    public function test_password_field_is_optional(): void
    {
        $this->superAdmin();

        $userToUpdate = User::factory()->create();

        $data = [
            'name' => 'John Doe',
            'email' => 'valid@example.com',
            'password' => null,
            'is_super_admin' => true,
        ];

        $response = $this->put(route('users.update', $userToUpdate), $data);

        $response->assertSessionDoesntHaveErrors('password');
        $response->assertSessionHas('success');
    }
}
