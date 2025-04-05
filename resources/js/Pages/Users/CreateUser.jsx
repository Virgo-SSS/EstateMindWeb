import { EyeIcon, EyeOff, LoaderCircle } from "lucide-react";
import Button from "../../components/ui/button/Button";
import Input from "../../components/ui/input/Input";
import Select from "../../components/ui/input/Select";
import Label from "../../components/ui/label/Label";
import AppLayout from "../../layout/AppLayout";
import { useMemo, useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function CreateUser() {
    const pageProps = usePage().props
    const [ showPassword, setShowPassword ] = useState(false)
    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
        name: "",
        email: "",
        password: "",
        role: "",
    });

    const roleOptions = useMemo(() => [
        { label: "Select Role", value: "", disabled: true },
        { label: "Super Admin", value: 1 },
        { label: "Admin", value: 2 },
    ], []);

    const handleSave = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return
        }

        post(route("users.store"), {
            onSuccess: () => {
                reset();
            },
            onError: (err) => {
                // TODO: Handle error case (e.g., show a toast notification)
                console.log("Failed to create user:", err);
            }
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        clearErrors(name);
        setData(name, value);
    }

    const validateForm = () => {
        const requiredFields = ["name", "email", "password", "role"];
        let allFieldsFilled = true;

        requiredFields.forEach(field => {
            if (!data[field]) {
                setError(field, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                allFieldsFilled = false;
            } else {
                clearErrors(field);
            }
        });

        return allFieldsFilled;
    }

    return (
        <>
            <AppLayout>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <Link
                        href={route("users.index")}
                        className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    >
                        Users
                    </Link>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-6xl mx-auto">
                        <div className="px-6 py-5">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                                Create User
                            </h3>
                        </div>
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                            <div className="space-y-6">
                                <form onSubmit={handleSave}>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="name">
                                                Name <span className="text-error-500">*</span>{" "}
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="Name"
                                                required
                                                value={data.name}
                                                onChange={handleChange}
                                                error={!!errors.name}
                                                hint={errors.name}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">
                                                Email <span className="text-error-500">*</span>{" "}
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                placeholder="Email address"
                                                value={data.email}
                                                onChange={handleChange}
                                                error={!!errors.email}
                                                hint={errors.email}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="password">
                                                Password <span className="text-error-500">*</span>{" "}
                                            </Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                required
                                                icon={showPassword ? (
                                                    <EyeIcon className="dark:text-white" />
                                                ) : (
                                                    <EyeOff className="dark:text-white" />
                                                )}
                                                iconOnClick={() => setShowPassword(!showPassword)}
                                                value={data.password}
                                                onChange={handleChange}
                                                error={!!errors.password}
                                                hint={errors.password}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="role">
                                                Role <span className="text-error-500">*</span>{" "}
                                            </Label>
                                            <Select
                                                id="role"
                                                name="role"
                                                required
                                                placeholder="Role"
                                                options={roleOptions}
                                                value={data.role}
                                                onChange={handleChange}
                                                error={!!errors.role}
                                                hint={errors.role}
                                            />
                                        </div>
                                        <div className="col-span-full">
                                            {
                                                pageProps.flash.success && (
                                                    <div className="text-sm text-green-500 mb-2">
                                                        {pageProps.flash.success}
                                                    </div>
                                                )
                                            }
                                            <Button
                                                size="sm"
                                                disabled={processing}
                                            >
                                                {processing && (
                                                    <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />
                                                )}
                                                Create User
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}