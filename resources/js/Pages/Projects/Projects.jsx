import AppLayout from "../../layout/AppLayout";
import { CopyPlus, LoaderCircle } from "lucide-react";
import TableListProject from "./TableListProject";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal/Modal";
import { useModal } from "../../hooks/useModal";
import Label from "../../components/ui/label/Label";
import Input from "../../components/ui/input/Input";
import { useForm } from "@inertiajs/react";
  
export default function Projects({ projects }) {
    const { isOpen, openModal, closeModal } = useModal();
    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
        name: "",
    });

    const handleSave = (e) => {
        e.preventDefault();

        if(!data.name) {
            setError("name", "Project name is required");
            return;
        }

        post(route("projects.store"), {
            onSuccess: () => {
                reset();
                closeModal();
            },
            onError: (err) => {
                // TODO: Handle error case (e.g., show a toast notification)
                console.log("Failed to create project:", err);
            }
        });
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSave(e);
        }
    }

    const handleModalClose = () => {
        reset();
        clearErrors();
        closeModal();
    }

    return (
        <>
            <AppLayout>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2
                        className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    >
                        Projects
                    </h2>
                    <Button
                        onClick={openModal}
                        size="xs"
                        startIcon={<CopyPlus className="w-4 h-4 mr-2" />}
                    >
                        New Project
                    </Button>
                </div>

                <div className="space-y-6">
                    <TableListProject projects={projects}/>
                </div>
            </AppLayout>

            <Modal isOpen={isOpen} onClose={handleModalClose} className="max-w-[500px] m-4">
                <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Create New Project
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Create a new project by filling out the form below.
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={handleSave} onKeyDown={handleKeyDown}>
                        <div className="h-[80px] px-2 pb-3">
                            <div className="mb-4">
                                <Label htmlFor="name">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    placeholder={"Project Name"}
                                    value={data.name}
                                    onChange={e => setData("name", e.target.value)}
                                    error={!!errors.name}
                                    hint={errors.name}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={handleModalClose}>
                                Close
                            </Button>

                            <Button size="sm" type="submit" disabled={processing}>
                                {processing && (
                                    <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />
                                )}
                                Create Project
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
