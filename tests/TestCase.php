<?php

namespace Tests;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function superAdmin(): User
    {
        $superAdmin = User::factory()->create(['role' => UserRole::SUPER_ADMIN]);

        $this->actingAs($superAdmin);

        return $superAdmin;
    }

    public function nonSuperAdmin(): User
    {
        $user = User::factory()->create(['role' => UserRole::ADMIN]);

        $this->actingAs($user);

        return $user;
    }
}
