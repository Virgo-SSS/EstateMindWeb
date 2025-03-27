import { useForm } from "@inertiajs/react";
import TableCard from "../../components/ui/table/TableCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
	TableRow
} from "../../components/ui/table/index";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import WarningModal from "../../components/ui/modal/WarningModal";
import Button from "../../components/ui/button/Button";
import { LoaderCircle } from "lucide-react";

export default function TableListProject ({ projects }) {
    const [isEditing, setIsEditing] = useState(false);
    const { isOpen, openModal, closeModal } = useModal();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
    })

    const { data: deleteData, setData: setDeleteData, processing: deleteProcessing, reset: deleteReset, delete: destroy } = useForm({
        project: null,
    })

    const handleUpdate = (e) => {
        e.preventDefault();

        post(route("project.update"), {
            onSuccess: () => {
                reset();
            }
        });
    }

    const handleDelete = (e) => {
        e.preventDefault();

        destroy(route("project.destroy", deleteData.project.id), {
            onSuccess: () => {
                closeModal();
                deleteReset();
            },
            onError: () => {
                console.log("Error deleting project");
            }
        })
    }

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
                                                    <div onClick={() => setIsEditing(!isEditing)} className="flex items-center cursor-pointer">
                                                        {
                                                            isEditing ? (
                                                                <form>
                                                                    <input
                                                                        type="text"
                                                                        value={data.name}
                                                                        onChange={e => setData('name', e.target.value)}
                                                                        className="border border-gray-300 rounded-md p-2"
                                                                    />
                                                                </form>
                                                            ) : (
                                                                <span>{project.name}</span>
                                                            )
                                                        }
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-40 ">
                                                    <Trash2 className="w-5 h-5 text-red-600 cursor-pointer" onClick={() => {
                                                        setDeleteData("project", project);
                                                        openModal();
                                                    }} />
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

            <WarningModal
                isOpen={isOpen} 
                onClose={closeModal} 
            >
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                    Delete {deleteData.project?.name} Project
                </h4>

                <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete {deleteData.project?.name} project? This action cannot be undone.
                </p>
                
                <div className="flex items-center justify-center w-full gap-3 mt-7">
                    <Button 
                        size="sm"  
                        disabled={deleteProcessing}
                        onClick={handleDelete}
                        className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-warning-500 shadow-theme-xs hover:bg-warning-600 sm:w-auto"
                    >
                        {deleteProcessing && (
                            <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />
                        )}
                        Delete Project
                    </Button>
                </div>
            </WarningModal>
        </>
    )
}