<?php

namespace Tests\Feature\Sales;

use App\Models\Project;
use App\Models\Sale;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class DeleteSaleTest extends TestCase
{
    public function createSale(): Sale
    {
        return Sale::factory()->for(
            Project::factory()->create()
        )->create();
    }

    public function test_guest_cannot_delete_sale(): void
    {
        $sale = $this->createSale();
        $response = $this->delete(route('sales.destroy', $sale));

        $response->assertRedirect(route('login'));
        $response->assertStatus(302);
        $this->assertDatabaseHas('sales', [
            'id' => $sale->id,
            'project_id' => $sale->project_id,
            'date' => $sale->date,
            'quantity' => $sale->quantity,
        ]);
    }

    public function test_user_can_delete_sale(): void
    {
        Cache::shouldReceive('forget')
            ->once()
            ->with('sales');
            
        $this->nonSuperAdmin();

        $sale = $this->createSale();

        $response = $this->delete(route('sales.destroy', $sale));

        $response->assertRedirect(route('sales.index'));
        $response->assertSessionHas('success', 'Sale deleted successfully.');
        $response->assertStatus(302);
        $this->assertDatabaseMissing('sales', $sale->toArray());
    }
}
