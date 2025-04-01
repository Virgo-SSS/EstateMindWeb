import { EyeIcon, EyeOff, LoaderCircle } from "lucide-react";
import Input from "../../components/ui/input/Input";
import Label from "../../components/ui/label/Label";
import AppLayout from "../../layout/AppLayout"
import Select from "../../components/ui/input/Select";
import Button from "../../components/ui/button/Button";
import { Link, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function EditUser({ user }) {
    const [ showPassword, setShowPassword ] = useState(false)
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
    })

    const roleOptions = useMemo(() => [
        { label: "Select Role", value: "", disabled: true },
        { label: "Super Admin", value: 1 },
        { label: "Admin", value: 2 },
    ], []);

    const handleSave = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setData({...data})
            return;
        }

        put(route("users.update", user.id), {
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                // TODO: Handle error case (e.g., show a toast notification)
                console.error("Failed to update project:", errors);
            }
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (errors[name]) {
            delete errors[name];
        }
        setData(name, value);
    }

    const validateForm = () => {
        const requiredFields = ["name", "email", "role"];
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
                        href={route("users.index")}
                        className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    >
                        Users
                    </Link>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-2/3">
                        <div className="px-6 py-5">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                                Update User {user.name}
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
                                                isRequired={true}
                                                value={data.name}
                                                onChange={handleChange}
                                                error={errors.name ? true : false}
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
                                                isRequired={true}
                                                placeholder="Email address"
                                                value={data.email}
                                                onChange={handleChange}
                                                error={errors.email ? true : false}
                                                hint={errors.email}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                icon={showPassword ? (
                                                    <EyeIcon className="dark:text-white" />
                                                ) : (
                                                    <EyeOff className="dark:text-white" />
                                                )}
                                                iconOnClick={() => setShowPassword(!showPassword)}
                                                value={data.password}
                                                onChange={handleChange}
                                                error={errors.password ? true : false}
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
                                                required={true}
                                                placeholder="Role"
                                                options={roleOptions}
                                                value={data.role}
                                                onChange={handleChange}
                                                error={errors.role ? true : false}
                                                hint={errors.role}
                                            />
                                        </div>
                                        <div className="col-span-full">
                                            <Button
                                                size="sm"
                                                disabled={processing}
                                            >
                                                {processing && (
                                                    <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />
                                                )}
                                                Update User
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
