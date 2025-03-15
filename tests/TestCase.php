<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function superAdmin(): User
    {
        $superAdmin = User::factory()->create(['is_super_admin' => true]);

        $this->actingAs($superAdmin);

        return $superAdmin;
    }

    public function nonSuperAdmin(): User
    {
        $user = User::factory()->create(['is_super_admin' => false]);

        $this->actingAs($user);

        return $user;
    }
}
