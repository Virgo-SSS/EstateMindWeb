<?php

namespace Tests\Feature\Sales;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class CreateSaleTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_user_cannot_access_create_sale_page(): void
    {
        $response = $this->get(route('sales.create'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_access_create_sale_page(): void
    {
        $this->nonSuperAdmin();

        $response = $this->get(route('sales.create'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
            ->component('Sales/CreateSale')
            ->has('projects')
        );
    }

    public function test_guest_user_cannot_store_sales(): void
    {
        $response = $this->post(route('sales.store'), [
            'project_id' => 1,
            'date' => '2021-10',
            'quantity' => 10,
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_store_sales(): void
    {
        Cache::shouldReceive('forget')
            ->once()
            ->with('sales');

        $this->nonSuperAdmin();

        $projects = Project::factory()->count(3)->create();

        $sales = [];

        foreach ($projects as $project) {
            for($month = 1; $month <= 3; $month++) {
                $sales[] = [
                    'project' => $project->id,
                    'date' => now()->addMonths($month)->format('Y-m'),
                    'quantity' => rand(1, 100),
                ];
            }
        }

        $request = [
            'sales' => $sales,
        ];

        $response = $this->post(route('sales.store'), $request);

        $response->assertStatus(302);
        $response->assertRedirect(route('sales.index'));
        $response->assertSessionHas('success', 'Sale created successfully.');
        $this->assertDatabaseCount('sales', 9);

        foreach ($sales as $sale) {
            $this->assertDatabaseHas('sales', [
                'project_id' => $projects->where('id', $sale['project'])->first()->id,
                'date' => $sale['date'] . '-01',
                'quantity' => $sale['quantity'],
            ]);
        }
    }

    /**
     * TEST VALIDATION RULES
     * 
     */

    public function test_validation_sales_is_required(): void
    {
        $this->nonSuperAdmin();

        $response = $this->post(route('sales.store'), [
            'sales' => '',
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors([
            'sales' => 'The sales field is required.',
        ]);
        $this->assertDatabaseMissing('sales', [
            'project_id' => null,
            'date' => null,
            'quantity' => null,
        ]);
    }

    public function test_validation_sales_must_be_array(): void
    {
        $this->nonSuperAdmin();

        $response = $this->post(route('sales.store'), [
            'sales' => 'string',
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors([
            'sales' => 'The sales field must be an array.',
        ]);
        $this->assertDatabaseMissing('sales', [
            'project_id' => null,
            'date' => null,
            'quantity' => null,
        ]);
    }

    public function test_validation_all_sub_field_is_required(): void
    {
        $this->nonSuperAdmin();

        $response = $this->post(route('sales.store'), [
            'sales' => [
                [
                    'project' => '',
                    'date' => '',
                    'quantity' => '',
                ],
            ],
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors([
            'sales.0.project' => 'The sales project field is required.',
            'sales.0.date' => 'The sales date field is required.',
            'sales.0.quantity' => 'The sales quantity field is required.',
        ]);
        $this->assertDatabaseMissing('sales', [
            'project_id' => null,
            'date' => null,
            'quantity' => null,
        ]);
    }

    public function test_validation_date_must_be_valid_date(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->post(route('sales.store'), [
            'sales' => [
                [
                    'project' => $project->id,
                    'date' => 'sfsefs',
                    'quantity' => 10,
                ],
            ],
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors([
            'sales.0.date' => 'The sales date field must be a valid date.',
        ]);
        $this->assertDatabaseMissing('sales', [
            'project_id' => $project->id,
            'date' => 'sfsefs',
            'quantity' => 10,
        ]);
    }

    public function test_validation_date_must_be_valid_date_format(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->post(route('sales.store'), [
            'sales' => [
                [
                    'project' => $project->id,
                    'date' => '10-01-2021',
                    'quantity' => 10,
                ],
            ],
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors([
            'sales.0.date' => 'The sales date field must match the format Y-m.',
        ]);

        $this->assertDatabaseMissing('sales', [
            'project_id' => null,
            'date' => '10-01-2021',
            'quantity' => 10,
        ]);
    }

    public function test_validation_quantity_must_be_numeric(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->post(route('sales.store'), [
            'sales' => [
                0 => [
                    'project' => $project->id,
                    'date' => now()->format('Y-m'),
                    'quantity' => 'abc',
                ],
            ],
        ]);;

        $response->assertStatus(302);
        $response->assertSessionHasErrors([
            'sales.0.quantity' => 'The sales quantity field must be a number.',
        ]);
        $this->assertDatabaseMissing('sales', [
            'project_id' => $project->id,
            'date' => now()->format('Y-m') . '-01',
            'quantity' => 'abc',
        ]);
    }

    public function test_validation_quantity_cannot_be_negative(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $response = $this->post(route('sales.store'), [
            'sales' => [
                0 => [
                    'project' => $project->id,
                    'date' => now()->format('Y-m'),
                    'quantity' => -10,
                ],
            ],
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors([
            'sales.0.quantity' => 'The sales quantity field must be at least 0.',
        ]);
        $this->assertDatabaseMissing('sales', [
            'project_id' => $project->id,
            'date' => now()->format('Y-m') . '-01',
            'quantity' => -10,
        ]);
    }

    public function test_cannot_insert_sales_with_a_project_that_does_not_exist(): void
    {
        $this->nonSuperAdmin();

        $response = $this->post(route('sales.store'), [
            'sales' => [
                [
                    'project' => 9999999,
                    'date' => now()->format('Y-m'),
                    'quantity' => 10,
                ],
            ],
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors([
            'sales' => 'Project(s) with Ids: 9999999 is not found. Please create them first or check the spelling.',
        ]);
        $this->assertDatabaseMissing('sales', [
            'project_id' => 9999999,
            'date' => now()->format('Y-m') . '-01',
            'quantity' => 10,
        ]);
    }
}
