import AuthLayout from "./AuthLayout";
import { useState } from "react"
import { Link } from "@inertiajs/react"
import { EyeCloseIcon, EyeIcon } from "../../icons"
import Label from "../../components/form/Label"
import InputField from "../../components/form/input/InputField"
import Checkbox from "../../components/form/input/Checkbox"
import Button from "../../components/ui/button/Button"

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [isChecked, setIsChecked] = useState(false)

    return (
        <>
            <AuthLayout>
                <div className="flex flex-col flex-1">
                    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                        <div>
                            <div className={`w-full max-w-md p-8 rounded-xl shadow-2xl transition-colors duration-300 dark:bg-[#27347A] bg-white`}>
                                <div className="flex justify-center items-center mb-8">
                                    <h1 className={`text-2xl font-bold dark:text-white text-[#202A61]`}>PT Adi Bintan Permata</h1>
                                </div>

                                <form>
                                    <div className="mb-6">
                                        <Label>
                                            Email <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <InputField placeholder="info@gmail.com" />
                                    </div>

                                    <div className="mb-6">
                                        <Label>
                                            Password <span className="text-error-500">*</span>{" "}
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
                                                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <Checkbox checked={isChecked} onChange={setIsChecked} />

                                            <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                                                Keep me logged in
                                            </span>
                                        </div>

                                        <Link
                                            to="/reset-password"
                                            className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <Button className="w-full dark:bg-[#C9262C]" size="sm">
                                        Login
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        </>
    );
}
