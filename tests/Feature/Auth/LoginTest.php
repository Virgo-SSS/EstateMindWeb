<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_access_login_page(): void
    {
        $response = $this->get(route('login'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
            ->component('Auth/Login')
        );
    }

    public function test_auth_user_cant_access_login_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('login'));

        $response->assertRedirect(route('dashboard'));
    }

    public function test_user_can_login(): void
    {
        $user = User::factory()->create();

        $response = $this->post(route('login.attempt'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticated();
    }

    public function test_user_cant_login_with_invalid_credentials(): void
    {
        $user = User::factory()->create();

        $response = $this->post(route('login.attempt'), [
            'email' => $user->email,
            'password' => 'invalid-password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_user_cant_login_with_invalid_email(): void
    {
        $response = $this->post(route('login.attempt'), [
            'email' => 'invalid-email',
            'password' => 'password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_user_cant_login_with_invalid_email_and_password(): void
    {
        $response = $this->post(route('login.attempt'), [
            'email' => 'invalid-email',
            'password' => 'invalid-password',
        ]);

        $response->assertSessionHasErrors('email');
        $response->assertSessionDoesntHaveErrors('password');
        $this->assertGuest();
    }

    public function test_user_cant_login_with_empty_email(): void
    {
        $response = $this->post(route('login.attempt'), [
            'email' => '',
            'password' => 'password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_user_cant_login_with_empty_password(): void
    {
        $response = $this->post(route('login.attempt'), [
            'email' => 'agh@gmail.com',
            'password' => '',
        ]);

        $response->assertSessionHasErrors('password');
        $this->assertGuest();
    }

    public function test_user_cant_login_more_than_five_times_in_a_minute(): void
    {
        Event::fake();

        $user = User::factory()->create();

        for ($i = 0; $i < 5; $i++) {
            $response = $this->post(route('login.attempt'), [
                'email' => $user->email,
                'password' => 'invalid-password',
            ]);
        }

        $response = $this->post(route('login.attempt'), [
            'email' => $user->email,
            'password' => 'invalid-password',
        ]);

        Event::assertDispatched(Lockout::class);
        $response->assertSessionHasErrors('email', __('auth.throttle', [
            'seconds' => 60,
            'minutes' => 1,
        ]));
        $this->assertGuest();
    }
}
