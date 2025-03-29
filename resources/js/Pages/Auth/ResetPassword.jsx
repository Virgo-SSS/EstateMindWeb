import { Link, useForm } from "@inertiajs/react";
import AuthLayout from "../../layout/AuthLayout"
import Button from "../../components/ui/button/Button";
import { useState } from "react";
import Label from "../../components/ui/label/Label";
import Input from "../../components/ui/input/Input";
import { EyeIcon, EyeOff, LoaderCircle } from "lucide-react";

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!data.password || !data.password_confirmation) {
            if(!data.password) {
                errors.password = "Password is required"
            }
            
            if(!data.password_confirmation) {
                errors.password_confirmation = "Password confirmation is required"
            }

            // re-render the form
            setData({
                ...data,
                password: data.password,
                password_confirmation: data.password_confirmation
            })
            return
        }

        post(route("password.update"), {
            onFinish: () => {
                reset("password", "password_confirmation")
            },
            onError: (err) => {
                // TODO: Handle error case (e.g., show a toast notification)
                console.error("Failed to reset password:", err);
            }
        })
    }

    const handleOnChange = (e) => {
        setData(e.target.name, e.target.value)
        delete errors[e.target.name]
    }
    
    return (
        <>
            <AuthLayout>
                <div className="flex flex-col flex-1">
                    <div className="w-full max-w-md pt-10 mx-auto">
                        <Link className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            hhref={route("dashboard")} data-discover="true">
                            PT Adi Bintan Permata
                        </Link>
                    </div>
                    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                        <div>
                            <div className="mb-5 sm:mb-8">
                                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                    Setup New Password
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Please enter your new password to setup your account.
                                </p>
                            </div>

                            {
                                errors.email && (
                                    <div className="mb-4 text-sm text-red-500">
                                        {errors.email}
                                    </div>
                                )
                            }
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <Label htmlFor="password">
                                        New Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        icon={showPassword ? (
                                            <EyeIcon className="dark:text-white" />
                                        ) : (
                                            <EyeOff className="dark:text-white" />
                                        )}
                                        iconOnClick={() => setShowPassword(!showPassword)}
                                        value={data.password}
                                        onChange={handleOnChange}
                                        error={errors.password ? true : false}
                                        hint={errors.password}
                                    />
                                </div>

                                <div className="mb-6">
                                    <Label htmlFor="password_confirmation">
                                        Confirm New Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        icon={showConfirmPassword ? (
                                            <EyeIcon className="dark:text-white" />
                                        ) : (
                                            <EyeOff className="dark:text-white" />
                                        )}
                                        iconOnClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        value={data.password_confirmation}
                                        onChange={handleOnChange}
                                        error={errors.password_confirmation ? true : false}
                                        hint={errors.password_confirmation}
                                    />
                                </div>

                                <Button className="w-full dark:bg-[#C9262C]" size="sm"  disabled={processing}>
                                    {
                                        processing && (
                                            <LoaderCircle className="w-5 h-5 mr-0.5 text-white animate-spin" />
                                        )
                                    }
                                    Save New Password
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        </>
    );
}
