<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ChangePasswordTest extends TestCase
{
    public function test_guest_cant_change_password(): void
    {
        $this->get(route('settings.password'))
            ->assertRedirect(route('login'));

        $this->post(route('settings.password.update'))
            ->assertRedirect(route('login'));
    }

    public function test_auth_user_can_view_change_password_page(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->get(route('settings.password'));

        $response->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('Settings/Password')
        );
        $response->assertStatus(200);
    }

    public function test_auth_user_can_change_password(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->post(route('settings.password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertRedirect(route('settings.password'));
        $response->assertSessionHas('success', 'Password updated successfully.');
        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    }

    public function test_auth_user_cant_change_password_with_invalid_current_password(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->post(route('settings.password.update'), [
            'current_password' => 'invalid-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertSessionHasErrors('current_password', 'The provided password does not match your current password.');
        $this->assertFalse(Hash::check('new-password', $user->refresh()->password));
    }

    public function test_auth_user_cant_change_password_with_invalid_password_confirmation(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->post(route('settings.password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'invalid-password',
        ]);

        $response->assertSessionHasErrors('password', 'The password confirmation does not match.');
        $this->assertFalse(Hash::check('new-password', $user->refresh()->password));
    }

    public function test_auth_user_cant_change_password_with_short_password(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->post(route('settings.password.update'), [
            'current_password' => 'password',
            'password' => 'short',
            'password_confirmation' => 'short',
        ]);

        $response->assertSessionHasErrors('password', 'The password must be at least 8 characters.');
        $this->assertFalse(Hash::check('short', $user->refresh()->password));
    }

    public function test_auth_user_cant_change_password_if_the_fields_are_empty(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->post(route('settings.password.update'), [
            'current_password' => '',
            'password' => '',
            'password_confirmation' => '',
        ]);

        $response->assertSessionHasErrors([
            'current_password' => 'The current password field is required.',
            'password' => 'The password field is required.',
        ]);
        $this->assertFalse(Hash::check('', $user->refresh()->password));
    }
}
