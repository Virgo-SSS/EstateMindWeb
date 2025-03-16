<?php

namespace Tests\Feature\Sales;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class SaleTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cant_access_sales(): void
    {
        $response = $this->get(route('sales.index'));

        $response->assertRedirect(route('login'));
        $response->assertStatus(302);
    }

    public function test_authenticated_user_can_access_sales(): void
    {
        $this->nonSuperAdmin();

        $response = $this->get(route('sales.index'));

        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Sales/Sales')
            ->has('sales')
        );
        $response->assertStatus(200);
    }
}
