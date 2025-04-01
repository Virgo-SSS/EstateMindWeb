<?php

namespace App\Http\Controllers;

use App\ActionContracts\Sales\CreateSaleActionInterface;
use App\ActionContracts\Sales\EditSaleActionInterface;
use App\DataTransferObjects\Sales\CreateSaleDTO;
use App\Http\Requests\Sales\SaleStoreRequest;
use App\Http\Requests\Sales\SaleUpdateRequest;
use App\Models\Project;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Sales/Sales', [
            'sales' => Cache::remember('sales', 60 * 60 * 12, function () {
                return Sale::query()
                    ->with(['project'])
                    ->latest()
                    ->get();
            }),
        ]);
    }

    public function create(): Response
    {
        $projects = Project::query()->get();

        return Inertia::render('Sales/CreateSale', [
            'projects' => $projects
        ]);
    }

    public function store(SaleStoreRequest $request, CreateSaleActionInterface $action): RedirectResponse
    {
        $action->handle(
            CreateSaleDTO::fromArray($request->validated())
        );

        return redirect()->route('sales.index')->with('success', 'Sale created successfully.');
    }

    public function edit(Sale $sale): Response
    {
        $projects = Project::query()->get();

        return Inertia::render('Sales/EditSale', [
            'sale' => $sale,
            'projects' => $projects
        ]);
    }

    public function update(SaleUpdateRequest $request, Sale $sale, EditSaleActionInterface $action): RedirectResponse
    {
        $action->handle(
            $sale,
            CreateSaleDTO::fromArray($request->validated())
        );

        return redirect()->route('sales.index')->with('success', 'Sale updated successfully.');
    }

    public function destroy(Sale $sale): RedirectResponse
    {
        $sale->delete();

        return redirect()->route('sales.index')->with('success', 'Sale deleted successfully.');
    }
}
