<?php

namespace Tests\Feature\Sales;

use App\Models\Project;
use App\Models\Sale;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
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
        );
    }

    public function test_guest_cannot_update_sale(): void
    {
        $sale = $this->createSale();

        $request = [
            'quantity' => 10,
        ];

        $response = $this->put(route('sales.update', $sale), $request);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseMissing('sales', $request);
    }

    public function test_user_can_update_sale(): void
    {
        Cache::shouldReceive('forget')
        ->once()
        ->with('sales');

        $this->nonSuperAdmin();

        $sale = $this->createSale();

        $request = [
            'quantity' => 10,
        ];

        $response = $this->put(route('sales.update', $sale), $request);

        $response->assertRedirect(route('sales.index'));
        $response->assertSessionHas('success', 'Sale updated successfully.');
        $this->assertDatabaseHas('sales', [
            'project_id' => $sale->project_id,
            'date' => $sale->date,
            'quantity' => $request['quantity'],
        ]);
    }

    #[DataProvider('validationDataProvider')]
    public function test_validation_rules(string $field, mixed $value, string $expectedError): void
    {
        $this->nonSuperAdmin();

        $sale = $this->createSale();

        $data = [
            'quantity' => 10,
        ];

        $data[$field] = $value;

        $response = $this->put(route('sales.update', $sale), $data);

        $response->assertSessionHasErrors([$field => $expectedError]);
        $this->assertDatabaseMissing('sales', [
            'project_id' => $sale->project_id,
            'date' => $sale->date,
            'quantity' => $data['quantity'],
        ]);
        $this->assertDatabaseHas('sales', [
            'project_id' => $sale->project_id,
            'date' => $sale->date,
            'quantity' => $sale->quantity,
        ]);
    }

    public static function validationDataProvider(): array
    {
        return [
            'quantity is required' => ['quantity', '', 'The quantity field is required.'],
            'quantity must be integer' => ['quantity', 'abc', 'The quantity field must be an integer.'],
            'quantity must be at least 1' => ['quantity', 0, 'The quantity field must be at least 1.'],
        ];
    }
}
