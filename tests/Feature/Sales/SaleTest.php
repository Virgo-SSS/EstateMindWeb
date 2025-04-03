<?php

namespace Tests\Feature\Sales;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
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
        Cache::shouldReceive('remember')
            ->once()
            ->with('sales', 60 * 60 * 12, \Closure::class)
            ->andReturn(collect());

        $this->nonSuperAdmin();

        $response = $this->get(route('sales.index'));

        $response->assertInertia(
            fn (AssertableInertia $page) => $page
            ->component('Sales/Sales')
            ->has('sales')
        );
        $response->assertStatus(200);
    }

    public function test_can_downwload_sales_sample_file(): void
    {
        $this->nonSuperAdmin();

        $response = $this->get(route('sales.download.sample'));
        $response->assertStatus(200);
        $response->assertDownload('SalesSample.xlsx');
    }
}
