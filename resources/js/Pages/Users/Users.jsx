import { CopyPlus, Pencil, Search, Trash2 } from "lucide-react";
import Button from "../../components/ui/button/Button";
import AppLayout from "../../layout/AppLayout";
import { Link } from "@inertiajs/react";
import Table from "../../components/ui/table/Table";
import TableHeaderCell from "../../components/ui/table/TableHeaderCell";
import TableDataCell from "../../components/ui/table/TableDataCell";
import TableCard from "../../components/ui/table/TableCard";
import TableCardHeader from "../../components/ui/table/TableCardHeader";
import TableCardBody from "../../components/ui/table/TableCardBody";
import TableHeader from "../../components/ui/table/TableHeader";
import Input from "../../components/ui/input/Input";
import Select from "../../components/ui/input/Select";
import EmptyTableRow from "../../components/ui/table/EmptyTableRow";

export default function Users({ users }) {
    const tableHeaders = [
        { name: "No.", key: "no" },
        { name: "Name", key: "name" },
        { name: "Email", key: "email" },
        { name: "Role", key: "role" },
        { name: "Actions", key: "actions" },
    ];

    const hasUsers = users.length > 0;

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
                    <TableCard>
                        <TableCardHeader>
                            <form className="w-4xl">
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Filter by Name"
                                    />
                                    <Input
                                        placeholder="Filter by Email"
                                    />
                                    <Select
                                        placeholder="Filter by Role"
                                        options={[
                                            { label: "Super Admin", value: 1 },
                                            { label: "Admin", value: 0 },
                                        ]}
                                    />
                                    <Button
                                        type="button"
                                        size="sm"
                                        startIcon={<Search className="w-4 h-4 mr-1" />}
                                    >
                                        Filter
                                    </Button>
                                </div>
                            </form>
                        </TableCardHeader>
                        <TableCardBody>
                            <Table>
                                <TableHeader>
                                    <tr>
                                        {tableHeaders.map((header) => (
                                            <TableHeaderCell key={header.key}>
                                                {header.name}
                                            </TableHeaderCell>
                                        ))}
                                    </tr>
                                </TableHeader>
                                <tbody>
                                    {
                                        hasUsers ? (
                                            users.map((user, index) => (
                                                <tr key={user.id}>
                                                    <TableDataCell>{index + 1}</TableDataCell>
                                                    <TableDataCell>{user.name}</TableDataCell>
                                                    <TableDataCell>{user.email}</TableDataCell>
                                                    <TableDataCell>
                                                        {user.is_super_admin ? "Super Admin" : "Admin"}
                                                    </TableDataCell>
                                                    <TableDataCell>
                                                        <Link href={route("users.edit", user.id)}>
                                                            <button className="text-blue-500 hover:text-blue-700">
                                                                <Pencil className="w-4.5 h-4.5 mr-2" />
                                                            </button>
                                                        </Link>
                                                        <span className="mx-2">
                                                            |
                                                        </span>
                                                        <button className="text-red-500 hover:text-red-700">
                                                            <Trash2 className="w-4.5 h-4.5 ml-2 cursor-pointer " />
                                                        </button>
                                                    </TableDataCell>
                                                </tr>
                                            ))
                                        ) : (
                                            <EmptyTableRow message="No users found." />
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
