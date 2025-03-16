<?php

namespace App\Http\Controllers;

use App\ActionContracts\Sales\CreateSaleActionInterface;
use App\DataTransferObjects\Sales\CreateSaleDTO;
use App\Http\Requests\Sales\SaleStoreRequest;
use App\Http\Requests\Sales\SaleUpdateRequest;
use App\Models\Project;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Sales/Sales', [
            'sales' => Sale::query()->get()
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

    public function update(SaleUpdateRequest $request)
}
