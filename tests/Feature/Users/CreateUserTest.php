<?php

namespace Tests\Feature\Users;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class CreateUserTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_access_create_user_page(): void
    {
        $this->superAdmin();

        $response = $this->get(route('users.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page->component('Users/CreateUser'));
    }

    public function test_non_super_admin_cannot_access_create_user_page(): void
    {
        $this->nonSuperAdmin();

        $response = $this->get(route('users.create'));

        $response->assertStatus(403);
    }

    public function test_guest_cannot_access_create_user_page(): void
    {
        $response = $this->get(route('users.create'));

        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
    }

    public function test_non_super_admin_cannot_create_user(): void
    {
        $this->nonSuperAdmin();

        $request = User::factory()->make()->toArray();
        $request['password'] = 'password';

        $response = $this->post(route('users.store'), $request);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('users', [
            'email' => $request['email'],
            'name' => $request['name'],
            'role' => $request['role']
        ]);
    }

    public function test_guest_cannot_create_user(): void
    {
        $request = User::factory()->make()->toArray();
        $request['password'] = 'password';

        $response = $this->post(route('users.store'), $request);

        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
        $this->assertDatabaseMissing('users', [
            'email' => $request['email'],
            'name' => $request['name'],
            'role' => $request['role']
        ]);
    }

    #[DataProvider('validationProvider')]
    public function test_validation_rules(string $field, mixed $value, string $validationMessage, ?callable $setup = null): void
    {
        if ($setup) {
            $setup();
        }

        $this->superAdmin();

        $data = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'role' => UserRole::ADMIN->value,
        ];

        $data[$field] = $value;

        $response = $this->post(route('users.store'), $data);

        $response->assertSessionHasErrors([$field => $validationMessage]);
        $response->assertStatus(302);
    }

    public static function validationProvider(): array
    {
        return [
            'name is required' => [
                'field' => 'name',
                'value' => '',
                'validationMessage' => 'The name field is required.',
            ],
            'name must be string' => [
                'field' => 'name',
                'value' => 12345,
                'validationMessage' => 'The name field must be a string.',
            ],
            'name max length is 255' => [
                'field' => 'name',
                'value' => str_repeat('a', 256),
                'validationMessage' => 'The name field must not be greater than 255 characters.',
            ],
            'email is required' => [
                'field' => 'email',
                'value' => '',
                'validationMessage' => 'The email field is required.',
            ],
            'email must be valid' => [
                'field' => 'email',
                'value' => 'invalid-email',
                'validationMessage' => 'The email field must be a valid email address.',
            ],
            'email must be unique' => [
                'field' => 'email',
                'value' => 'existing@example.com',
                'validationMessage' => 'The email has already been taken.',
                'setup' => function () {
                    User::factory()->create(['email' => 'existing@example.com']);
                },
            ],
            'password is required' => [
                'field' => 'password',
                'value' => '',
                'validationMessage' => 'The password field is required.',
            ],
            'password must be string' => [
                'field' => 'password',
                'value' => 12345678,
                'validationMessage' => 'The password field must be a string.',
            ],
            'password minimum length is 8' => [
                'field' => 'password',
                'value' => '1234567',
                'validationMessage' => 'The password field must be at least 8 characters.',
            ],
            'role is required' => [
                'field' => 'role',
                'value' => '',
                'validationMessage' => 'The role field is required.',
            ],
            'role must be integer' => [
                'field' => 'role',
                'value' => 'invalid',
                'validationMessage' => 'The role field must be an integer.',
            ],
            'role must be valid enum' => [
                'field' => 'role',
                'value' => 99999,
                'validationMessage' => 'The selected role is invalid.',
            ],
        ];
    }

    public function test_super_admin_can_create_user(): void
    {
        Cache::shouldReceive('forget')
            ->once()
            ->with('users');

        $this->superAdmin();

        $request = User::factory()->make()->toArray();
        $request['password'] = 'password';

        $response = $this->post(route('users.store'), $request);

        $response->assertStatus(302);
        $response->assertRedirect(route('users.index'));
        $response->assertSessionHas('success', 'User created successfully.');
        $this->assertDatabaseHas('users', [
            'email' => $request['email'],
            'name' => $request['name'],
            'role' => $request['role'],
        ]);
        ;
    }
}
