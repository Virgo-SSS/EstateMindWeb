<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;
use Illuminate\Auth\Notifications\ResetPassword;

class ForgotPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_forgot_password_request_form(): void
    {
        $response = $this->get(route('password.request'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page->component('Auth/ForgotPassword')
        );
    }

    public function test_user_can_request_reset_password_link(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $response = $this->post(route('password.email'), [
            'email' => $user->email,
        ]);

        $response->assertRedirect(route('password.request'));
        $response->assertSessionHas('status', __(Password::RESET_LINK_SENT));
        Notification::assertSentTo([$user], ResetPassword::class);
    }

    public function test_user_cannot_request_reset_password_link_with_invalid_email(): void
    {
        Notification::fake();

        $response = $this->post(route('password.email'), [
            'email' => 'invalid@gmail.com',
        ]);

        $response->assertRedirect(route('password.request'));
        $response->assertSessionHasErrors('email', __(Password::INVALID_USER));
        Notification::assertNothingSent();
    }

    public function test_user_cannot_request_reset_password_link_with_empty_email(): void
    {
        Notification::fake();
        $response = $this->post(route('password.email'), [
            'email' => '',
        ]);

        $response->assertSessionHasErrors('email', __('validation.required', ['attribute' => 'email']));
        $response->assertStatus(302);
        Notification::assertNothingSent();
    }

    public function test_user_cannot_request_reset_password_link_with_invalid_email_format(): void
    {
        Notification::fake();
        $response = $this->post(route('password.email'), [
            'email' => 'invalid',
        ]);

        $response->assertSessionHasErrors('email', __('validation.email', ['attribute' => 'email']));
        $response->assertStatus(302);
        Notification::assertNothingSent();
    }

    public function test_user_need_to_wait_before_requesting_reset_password_link(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $response = $this->post(route('password.email'), [
            'email' => $user->email,
        ]);

        $response->assertRedirect(route('password.request'));
        $response->assertSessionHas('status', __(Password::RESET_LINK_SENT));
        Notification::assertSentTo([$user], ResetPassword::class);

        // tring to send another reset password link after the first one
        $response = $this->post(route('password.email'), [
            'email' => $user->email,
        ]);

        $response->assertRedirect(route('password.request'));
        $response->assertSessionHasErrors('email', __(Password::RESET_THROTTLED));
    }
}
