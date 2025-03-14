<?php

namespace Tests\Feature\Users;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
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

    public function test_super_admin_can_create_user(): void
    {
        $superAdmin = User::factory()->create(['is_super_admin' => true]);
        $this->actingAs($superAdmin);

        $request = User::factory()->make()->toArray();
        $request['password'] = 'password';

        $response = $this->post(route('users.store'), $request);

        $response->assertStatus(302);
        $response->assertRedirect(route('users.index'));
        $response->assertSessionHas('success', 'User created successfully.');
        $this->assertDatabaseHas('users', ['email' => $request['email'], 'name' => $request['name'], 'is_super_admin' => $request['is_super_admin']]);
    }

    public function test_non_super_admin_cannot_create_user(): void
    {
        $user = User::factory()->create(['is_super_admin' => false]);
        $this->actingAs($user);

        $request = User::factory()->make()->toArray();
        $request['password'] = 'password';

        $response = $this->post(route('users.store'), $request);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('users', ['email' => $request['email'], 'name' => $request['name'], 'is_super_admin' => $request['is_super_admin']]);
    }

    public function test_guest_cannot_create_user(): void
    {
        $request = User::factory()->make()->toArray();
        $request['password'] = 'password';

        $response = $this->post(route('users.store'), $request);

        $response->assertStatus(302);
        $response->assertRedirect(route('login'));
        $this->assertDatabaseMissing('users', ['email' => $request['email'], 'name' => $request['name'], 'is_super_admin' => $request['is_super_admin']]);
    }

    #[DataProvider('validationProvider')]
    public function test_validation_rules(string $field, mixed $value, array $validData = [], callable $setup = null): void
    {
        if ($setup) {
            $setup();
        }

        $superAdmin = User::factory()->create(['is_super_admin' => true]);

        $this->actingAs($superAdmin);

        $data = array_merge([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'is_super_admin' => false,
        ], $validData);

        $data[$field] = $value;

        $response = $this->post(route('users.store'), $data);

        $response->assertSessionHasErrors([$field]);
    }

    public static function validationProvider(): array
    {
        return [
            'name is required' => [
                'field' => 'name',
                'value' => '',
            ],
            'name must be string' => [
                'field' => 'name',
                'value' => 12345,
            ],
            'name max length is 255' => [
                'field' => 'name',
                'value' => str_repeat('a', 256),
            ],
            'email is required' => [
                'field' => 'email',
                'value' => '',
            ],
            'email must be valid' => [
                'field' => 'email',
                'value' => 'invalid-email',
            ],
            'email must be unique' => [
                'field' => 'email',
                'value' => 'existing@example.com',
                'validData' => [],
                'setup' => function () {
                    User::factory()->create(['email' => 'existing@example.com']);
                },
            ],
            'password is required' => [
                'field' => 'password',
                'value' => '',
            ],
            'password must be string' => [
                'field' => 'password',
                'value' => 12345678,
            ],
            'password minimum length is 8' => [
                'field' => 'password',
                'value' => '1234567',
            ],
            'is_super_admin is required' => [
                'field' => 'is_super_admin',
                'value' => null,
            ],
            'is_super_admin must be boolean' => [
                'field' => 'is_super_admin',
                'value' => 'invalid',
            ],
        ];
    }
}
