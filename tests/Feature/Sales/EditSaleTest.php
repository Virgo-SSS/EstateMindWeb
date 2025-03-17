<?php

namespace Tests\Feature\Sales;

use App\Models\Project;
use App\Models\Sale;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class EditSaleTest extends TestCase
{
    use RefreshDatabase;

    public function createSale(): Sale
    {
        return Sale::factory()->for(
            Project::factory()->create()
        )->create();
    }

    public function test_guest_cannot_access_edit_sale_page(): void
    {
        $sale = $this->createSale();

        $response = $this->get(route('sales.edit', $sale));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_access_edit_sale_page(): void
    {
        $this->nonSuperAdmin();

        $sale = $this->createSale();

        $response = $this->get(route('sales.edit', $sale));
        $response->assertOk();
        $response->assertInertia(
            fn (AssertableInertia $page) => $page
            ->component('Sales/EditSale')
            ->has('sale')
            ->has('projects')
        );
    }

    public function test_guest_cannot_update_sale(): void
    {
        $sale = $this->createSale();

        $request = [
            'project_id' => Project::factory()->create()->id,
            'date' => now()->format('Y-m-d'),
            'quantity' => 10,
        ];

        $response = $this->put(route('sales.update', $sale), $request);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseMissing('sales', $request);
    }

    public function test_user_can_update_sale(): void
    {
        $this->nonSuperAdmin();

        $sale = $this->createSale();

        $request = [
            'project_id' => Project::factory()->create()->id,
            'date' => now()->format('Y-m'),
            'quantity' => 10,
        ];

        $response = $this->put(route('sales.update', $sale), $request);

        $response->assertRedirect(route('sales.index'));
        $response->assertSessionHas('success', 'Sale updated successfully.');
        $this->assertDatabaseHas('sales', [
            'project_id' => $request['project_id'],
            'date' => $request['date'] . '-01',
            'quantity' => $request['quantity'],
        ]);
    }

    #[DataProvider('validationDataProvider')]
    public function test_validation_rules(string $field, mixed $value, string $expectedError): void
    {
        $this->nonSuperAdmin();

        $sale = $this->createSale();

        $data = [
            'project_id' => Project::factory()->create()->id,
            'date' => now()->format('Y-m-d'),
            'quantity' => 10,
        ];

        $data[$field] = $value;

        $response = $this->put(route('sales.update', $sale), $data);

        $response->assertSessionHasErrors([$field => $expectedError]);
    }

    public static function validationDataProvider(): array
    {
        return [
            // project_id validation
            'project_id is required' => ['project_id', '', 'The project id field is required.'],
            'project_id must be integer' => ['project_id', 'abc', 'The project id field must be an integer.'],
            'project_id must exist' => ['project_id', 99999, 'The selected project id is invalid.'],

            // date validation
            'date is required' => ['date', '', 'The date field is required.'],
            'date must be valid date' => ['date', 'not-a-date', 'The date field must be a valid date.'],

            // quantity validation
            'quantity is required' => ['quantity', '', 'The quantity field is required.'],
            'quantity must be integer' => ['quantity', 'abc', 'The quantity field must be an integer.'],
            'quantity must be at least 1' => ['quantity', 0, 'The quantity field must be at least 1.'],
        ];
    }
}
