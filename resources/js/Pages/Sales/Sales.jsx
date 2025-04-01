import { Link } from "@inertiajs/react";
import AppLayout from "../../layout/AppLayout"
import Button from "../../components/ui/button/Button";
import { CopyPlus } from "lucide-react";
import TableCard from "../../components/ui/table/TableCard";
import TableCardBody from "../../components/ui/table/TableCardBody";
import TableHeaderCell from "../../components/ui/table/TableHeaderCell";
import Table from "../../components/ui/table/Table";
import TableHeader from "../../components/ui/table/TableHeader";
import { useMemo } from "react";
import EmptyTableRow from "../../components/ui/table/EmptyTableRow";
import TableDataCell from "../../components/ui/table/TableDataCell";

export default function Sales({ sales }) {

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
                                                    {new Date(sale.created_at).toLocaleDateString()}
                                                </TableDataCell>
                                                <TableDataCell>
                                                    {sale.quantity}
                                                </TableDataCell>
                                                <TableDataCell>
                                                    <Link href={route("sales.edit", sale.id)}>
                                                        <Button
                                                            size="xs"
                                                            variant="outline"
                                                        >
                                                            Edit
                                                        </Button>
                                                    </Link>
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
        </>
    );
}
