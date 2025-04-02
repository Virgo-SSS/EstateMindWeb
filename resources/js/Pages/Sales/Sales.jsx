import { Link, useForm } from "@inertiajs/react";
import AppLayout from "../../layout/AppLayout"
import Button from "../../components/ui/button/Button";
import { CopyPlus, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import TableCard from "../../components/ui/table/TableCard";
import TableCardBody from "../../components/ui/table/TableCardBody";
import TableHeaderCell from "../../components/ui/table/TableHeaderCell";
import Table from "../../components/ui/table/Table";
import TableHeader from "../../components/ui/table/TableHeader";
import { useCallback, useMemo } from "react";
import EmptyTableRow from "../../components/ui/table/EmptyTableRow";
import TableDataCell from "../../components/ui/table/TableDataCell";
import WarningModal from "../../components/ui/modal/WarningModal";
import { useModal } from "../../hooks/useModal";

export default function Sales({ sales }) {
    const { isOpen, openModal, closeModal } = useModal()
    const deleteForm = useForm({
        sale: null,
    })

    const confirmDelete = useCallback((sale) => {
        deleteForm.setData("sale", sale);
        openModal();
    }, [deleteForm, openModal]);

    const handleDelete = (e) => {
        e.preventDefault();
        
        if (!deleteForm.data.sale?.id) {
            // TODO: Handle error case (e.g., show a toast notification)
            console.error("No sale selected for deletion.");
            closeModal();
            return;
        }

        deleteForm.delete(route("sales.destroy", deleteForm.data.sale.id), {
            onSuccess: () => {
                closeModal();
                deleteForm.reset();
            },
            onError: (errors) => {
                // TODO: Handle error case (e.g., show a toast notification)
                console.error("Failed to delete sales:", errors);
            }
        });
    }

    const hasSales = useMemo(() => {
        return sales.length > 0;
    }
    , [sales]);

    return (
        <>
            <AppLayout>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2
                        className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    >
                        Sales
                    </h2>
                    <Link href={route("sales.create")}>
                        <Button
                            size="xs"
                            startIcon={<CopyPlus className="w-4 h-4 mr-2" />}
                        >
                                New Sale
                        </Button>
                    </Link>
                </div>

                <div className="space-y-6">
                    <TableCard>
                        <TableCardBody>
                            <Table>
                                <TableHeader>
                                    <tr>
                                        <TableHeaderCell>Project</TableHeaderCell>
                                        <TableHeaderCell>Date</TableHeaderCell>
                                        <TableHeaderCell>Quantity</TableHeaderCell>
                                        <TableHeaderCell>Actions</TableHeaderCell>
                                    </tr>
                                </TableHeader>
                                <tbody>
                                    {
                                        hasSales ? sales.map((sale) => (
                                            <tr key={sale.id}>
                                                <TableDataCell>
                                                    {sale.project.name}
                                                </TableDataCell>
                                                <TableDataCell>
                                                    {new Date(sale.date).toLocaleDateString()}
                                                </TableDataCell>
                                                <TableDataCell>
                                                    {sale.quantity}
                                                </TableDataCell>
                                                <TableDataCell>
                                                    <Link href={route("sales.edit", sale.id)}>
                                                        <button className="text-blue-500 hover:text-blue-700">
                                                            <Pencil className="w-4.5 h-4.5 mr-2" />
                                                        </button>
                                                    </Link>
                                                    <span className="mx-2">
                                                        |
                                                    </span>
                                                    <button 
                                                        type="button"
                                                        aria-label={`Delete Sales`}
                                                        onClick={() => confirmDelete(sale)}
                                                        disabled={deleteForm.processing}
                                                        className="text-red-500 hover:text-red-700">
                                                        <Trash2 className="w-4.5 h-4.5 ml-2 cursor-pointer " />
                                                    </button>
                                                </TableDataCell>
                                            </tr>
                                        )) : (
                                            <EmptyTableRow message="No sales found" />
                                        )
                                    }
                                </tbody>
                            </Table>
                        </TableCardBody>
                    </TableCard>
                </div>
            </AppLayout>
            <WarningModal
                isOpen={isOpen} 
                onClose={closeModal}
                title={`Delete sale`}
                message={`Are you sure you want to delete sale? This action cannot be undone.`}
                confirmButton={
                    <Button
                        size="sm"
                        disabled={deleteForm.processing}
                        onClick={handleDelete}
                        className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-warning-500 shadow-theme-xs hover:bg-warning-600 sm:w-auto"
                    >
                        {deleteForm.processing && <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />}
                        Delete sale
                    </Button>
                }
                cancelButton={
                    <Button
                        type="button"
                        onClick={closeModal}
                        size="sm"
                        disabled={deleteForm.processing}
                        className="flex justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-lg bg-gray-500 shadow-theme-xs hover:bg-gray-700 sm:w-auto"
                    >
                        Cancel
                    </Button>
                }
            />
        </>
    );
}
