<?php

namespace App\Http\Controllers;

use App\ActionContracts\Sales\CreateSaleActionInterface;
use App\ActionContracts\Sales\EditSaleActionInterface;
use App\Http\Requests\Sales\SaleStoreRequest;
use App\Http\Requests\Sales\SaleUpdateRequest;
use App\Models\Project;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

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
        try {
            $action->handle(
                $request->validated()
            );
        } catch (\Exception $exception) {
            return redirect()->back()->withErrors([
                'sales' => $exception->getMessage(),
            ]);
        }

        return redirect()->route('sales.index')->with('success', 'Sale created successfully.');
    }

    public function edit(Sale $sale): Response
    {
        return Inertia::render('Sales/EditSale', [
            'sale' => $sale->load(['project']),
        ]);
    }

    public function update(SaleUpdateRequest $request, Sale $sale, EditSaleActionInterface $action): RedirectResponse
    {
        $action->handle(
            $sale,
            $request->validated()['quantity']
        );

        return redirect()->route('sales.index')->with('success', 'Sale updated successfully.');
    }

    public function destroy(Sale $sale): RedirectResponse
    {
        $sale->delete();

        Cache::forget('sales');

        return redirect()->route('sales.index')->with('success', 'Sale deleted successfully.');
    }

    public function downloadSample()
    {
        $pathToFile = public_path('storage/SalesSample.xlsx');
        $name = 'SalesSample.xlsx';
        $headers = [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $name . '"',
        ];

        if (!file_exists($pathToFile)) {
            abort(404, 'File not found.');
        }
        
        return response()->download($pathToFile, $name, $headers);
    }
}
