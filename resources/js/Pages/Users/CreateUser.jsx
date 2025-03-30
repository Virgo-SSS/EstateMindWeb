import { EyeIcon, EyeOff, LoaderCircle } from "lucide-react";
import Button from "../../components/ui/button/Button";
import Input from "../../components/ui/input/Input";
import Select from "../../components/ui/input/Select";
import Label from "../../components/ui/label/Label";
import AppLayout from "../../layout/AppLayout";
import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";

export default function CreateUser() {
    const [ showPassword, setShowPassword ] = useState(false)
    const pageProps = usePage().props
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        is_super_admin: "",
    });

    const handleSave = (e) => {
        e.preventDefault();

        if (!checkRequiredFields()) {
            setData({
                ...data,
                name: data.name,
                email: data.email,
                password: data.password,
                is_super_admin: data.is_super_admin,
            })
            
            return;
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
        if (errors[name]) {
            delete errors[name];
        }
        setData(name, value);
    }

    const checkRequiredFields = () => {
        const requiredFields = ["name", "email", "password", "is_super_admin"];
        let allFieldsFilled = true;

        requiredFields.forEach(field => {
            if (!data[field]) {
                let errorMessage = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                if(field === "is_super_admin") {
                    errorMessage = "Role is required";
                }

                errors[field] = errorMessage;
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
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-2/3">
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
                                            Password <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            isRequired={true}
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
                                        <Label htmlFor="is_super_admin">
                                            Role <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <Select
                                            id="is_super_admin"
                                            name="is_super_admin"
                                            required={true}
                                            placeholder="Role"
                                            options={[
                                                { label: "Select Role", value: "", disabled: true },
                                                { label: "Super Admin", value: 1 },
                                                { label: "Admin", value: 0 },
                                            ]}
                                            value={data.is_super_admin}
                                            onChange={handleChange}
                                            error={errors.is_super_admin ? true : false}
                                            hint={errors.is_super_admin}
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