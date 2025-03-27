import TableCard from "../../components/ui/table/TableCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
	TableRow
} from "../../components/ui/table/index";
import { Trash2 } from "lucide-react";

export default function TableListProject ({ projects }) {
    return (
        <>
            <TableCard title="Basic Table 1">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    {
                                        [
                                            "No",
                                            "Project Name",
                                            "Action"
                                        ].map((name, index) => (
                                            <TableCell
                                                key={index}
                                                isHeader
                                                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                            >
                                                {name}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                { 
                                    projects && projects.length > 0 ? (
                                        projects.map(project => (
                                            <TableRow key={project.id}>
                                                <TableCell className="px-5 py-4 sm:px-6 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {project.id}
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {project.name}
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <Trash2 className="w-5 h-5 text-red-600" />
                                                </TableCell>
                                            </TableRow>
                                        )) 
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="px-5 py-4 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                                                No projects available
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </TableCard>
        </>
    )
}