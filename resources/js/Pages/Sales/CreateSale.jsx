import { Link, useForm } from "@inertiajs/react";
import AppLayout from "../../layout/AppLayout";
import Label from "../../components/ui/label/Label";
import Input from "../../components/ui/input/Input";
import Button from "../../components/ui/button/Button";
import Select from "../../components/ui/input/Select";
import { Calendar, LoaderCircle } from "lucide-react";

export default function CreateSale({ projects }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        project_id: "",
        date: new Date(),
        quantity: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) {
            delete errors[name];
        }
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setData({ ...data });
            return;
        }

        post(route("sales.store"), {
            onSuccess: () => {
                reset();
            },
            onError: (err) => {
                // TODO: Handle error case (e.g., show a toast notification)
                console.log("Failed to create sale:", err);
            }
        });
    }

    const validateForm = () => {
        const requiredFields = ["project_id", "date", "quantity"];
        let allFieldsFilled = true;

        requiredFields.forEach(field => {
            if (!data[field]) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                allFieldsFilled = false;
            } else {
                delete errors[field];
            }
        });

        return allFieldsFilled;
    }

    return (
        <>
            <AppLayout>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <Link
                        href={route("sales.index")}
                        className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    >
                        Sales
                    </Link>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-2/3 mx-auto">
                        <div className="px-6 py-5">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                                Create Sale
                            </h3>
                        </div>
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                            <div className="space-y-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="project_id">
                                                Project <span className="text-error-500">*</span>{" "}
                                            </Label>
                                            <Select
                                                id="project_id"
                                                name="project_id"
                                                placeholder="Select Project"
                                                value={data.project_id}
                                                required={true}
                                                options={projects.map((project) => ({
                                                    value: project.id,
                                                    label: project.name,
                                                }))}
                                                onChange={handleChange}
                                                error={errors.project_id ? true : false}
                                                hint={errors.project_id}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="date">
                                                Month <span className="text-error-500">*</span>{" "}
                                            </Label>
                                            <div className="relative w-full flatpickr-wrapper">
                                                {/* TODO: Sementara pakai date dari html dulu sampai react-flatpickr sudah bisa jalan di react 19 */}
                                                <Input
                                                    id="date"
                                                    name="date"
                                                    type="month"
                                                    value={data.date}
                                                    onChange={handleChange}
                                                    error={errors.date ? true : false}
                                                    hint={errors.date}
                                                    placeholder="Select Month"
                                                />

                                                {/* <Flatpickr
                                                    id="datePicker"
                                                    name="date"
                                                    value={data.date}
                                                    options={{
                                                        dateFormat: "Y-m-d", // Set the date format
                                                    }}
                                                    placeholder="Select an option"
                                                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
                                                />
                                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                    <Calendar className="size-6" />
                                                </span> */}
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="quantity">
                                                Quantity <span className="text-error-500">*</span>{" "}
                                            </Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                name="quantity"
                                                isRequired={true}
                                                placeholder="Quantity"
                                                value={data.quantity}
                                                onChange={handleChange}
                                                error={errors.quantity ? true : false}
                                                hint={errors.quantity}
                                            />
                                        </div>
                                    </div>
                                    <Button className="mt-4" disabled={processing}>
                                        {processing && (
                                            <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />
                                        )}
                                        Create Sale
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
    