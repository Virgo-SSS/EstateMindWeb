<?php

namespace Tests\Feature\Sales;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class CreateSaleTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_user_cannot_access_create_sale_page(): void
    {
        $response = $this->get(route('sales.create'));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_access_create_sale_page(): void
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

    public function test_guest_user_cannot_create_sale(): void
    {
        $response = $this->post(route('sales.store'), [
            'project_id' => 1,
            'date' => '2021-10',
            'quantity' => 10,
        ]);

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_create_sale(): void
    {
        Cache::shouldReceive('forget')
            ->once()
            ->with('sales');
            
        $this->nonSuperAdmin();

        $project = Project::factory()->create();
        $date = now()->format('Y-m');

        $response = $this->post(route('sales.store'), [
            'project_id' => $project->id,
            'date' => $date,
            'quantity' => 10,
        ]);

        $response->assertRedirect(route('sales.index'));
        $response->assertSessionHas('success', 'Sale created successfully.');
        $this->assertDatabaseHas('sales', [
            'project_id' => $project->id,
            'date' => $date . '-01',
            'quantity' => 10,
        ]);
    }

    #[DataProvider('validationDataProvider')]
    public function testSaleValidationRules(string $field, mixed $value, string $expectedError): void
    {
        $this->nonSuperAdmin();

        // Create a project for valid requests
        $project = Project::factory()->create();

        // Base data for a valid request
        $data = [
            'project_id' => $project->id,
            'date' => '2023-05',
            'quantity' => 5,
        ];

        // Override the field being tested
        $data[$field] = $value;

        // Submit the request
        $response = $this->post(route('sales.store'), $data);

        // Assert validation error exists for the specified field
        $response->assertSessionHasErrors([$field => $expectedError]);
        $response->assertStatus(302);
        $this->assertDatabaseMissing('sales', [
            'project_id' => $project->id,
            'date' => '2023-05-01',
            'quantity' => 5,
        ]);
    }

    public static function validationDataProvider(): array
    {
        return [
            // project_id validation tests
            'project_id is required' => ['project_id', '', 'The project id field is required.'],
            'project_id must be integer' => ['project_id', 'abc', 'The project id field must be an integer.'],
            'project_id must exist' => ['project_id', 999, 'The selected project id is invalid.'],

            // date validation tests
            'date is required' => ['date', '', 'The date field is required.'],
            'date must be valid format' => ['date', 'invalid-date', 'The date field must be a valid date.'],

            // quantity validation tests
            'quantity is required' => ['quantity', '', 'The quantity field is required.'],
            'quantity must be integer' => ['quantity', 'abc', 'The quantity field must be an integer.'],
            'quantity must be at least 1' => ['quantity', 0, 'The quantity field must be at least 1.'],
            'quantity must be at least 1 (negative)' => ['quantity', -5, 'The quantity field must be at least 1.'],
        ];
    }

    public function test_user_cannot_create_sale_with_duplicate_date(): void
    {
        $this->nonSuperAdmin();

        $project = Project::factory()->create();

        $date = now()->addMonth()->format('Y-m');

        $this->post(route('sales.store'), [
            'project_id' => $project->id,
            'date' => $date,
            'quantity' => 5,
        ]);

        $response = $this->post(route('sales.store'), [
            'project_id' => $project->id,
            'date' => $date,
            'quantity' => 10,
        ]);

        $response->assertSessionHasErrors(['project_id' => 'The project id has already been taken.']);
        $response->assertStatus(302);
        $this->assertDatabaseMissing('sales', [
            'project_id' => $project->id,
            'date' => $date . '-01',
            'quantity' => 10,
        ]);
        $this->assertDatabaseHas('sales', [
            'project_id' => $project->id,
            'date' => $date . '-01',
            'quantity' => 5,
        ]);
    }
}
