import { Link } from "@inertiajs/react";
import InputField from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import AuthLayout from "../../layout/AuthLayout"
import Button from "../../components/ui/button/Button";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    
    return (
        <>
            <AuthLayout>
                <div className="flex flex-col flex-1">
                    <div className="w-full max-w-md pt-10 mx-auto">
                        <Link className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            href="/" data-discover="true">
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

                            <form>
                                <div className="mb-6">
                                    <Label>
                                        New Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <InputField
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            ) : (
                                                <EyeSlashIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <Label>
                                        Confirm New Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <InputField
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                        />
                                        <span
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            ) : (
                                                <EyeSlashIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <Button className="w-full dark:bg-[#C9262C]" size="sm">
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
