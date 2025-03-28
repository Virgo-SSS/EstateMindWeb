import { CopyPlus } from "lucide-react";
import Button from "../../components/ui/button/Button";
import AppLayout from "../../layout/AppLayout";
import { Link } from "@inertiajs/react";
import Table from "../../components/ui/table/Table";
import TableHeaderCell from "../../components/ui/table/TableHeaderCell";
import TableDataCell from "../../components/ui/table/TableDataCell";

export default function Users() {
    const tableHeaders = [
        { name: "Name", key: "name" },
        { name: "Email", key: "email" },
        { name: "Role", key: "role" },
        { name: "Actions", key: "actions" },
    ];
    return (
        <>
            <AppLayout>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2
                        className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    >
                        Users
                    </h2>
                    <Link href={route("users.create")}>
                        <Button
                            size="xs"
                            startIcon={<CopyPlus className="w-4 h-4 mr-2" />}
                        >
                                New User
                        </Button>
                    </Link>
                </div>

                <div className="space-y-6">
                    <Table>
                        <thead>
                            <tr>
                                {tableHeaders.map((header) => (
                                    <TableHeaderCell key={header.key}>
                                        {header.name}
                                    </TableHeaderCell>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(10)].map((_, index) => (
                                <tr key={index}>
                                    <TableDataCell>User {index + 1}</TableDataCell>
                                    <TableDataCell>user{index + 1}@example.com</TableDataCell>
                                    <TableDataCell>Role {index % 2 === 0 ? "Admin" : "User"}</TableDataCell>
                                    <TableDataCell>
                                        <button className="text-blue-500 hover:underline">Edit</button>
                                        <span className="mx-2">|</span>
                                        <button className="text-red-500 hover:underline">Delete</button>
                                    </TableDataCell>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </AppLayout>
        </>
    );
}
