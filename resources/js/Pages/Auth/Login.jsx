import AuthLayout from "../../layout/AuthLayout"
import { useState } from "react"
import { Link, useForm } from "@inertiajs/react"
import Label from "../../components/form/Label"
import InputField from "../../components/form/input/InputField"
import Checkbox from "../../components/form/input/Checkbox"
import Button from "../../components/ui/button/Button"
import { EyeIcon, EyeOff } from "lucide-react"

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [isChecked, setIsChecked] = useState(false)

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        
        post(route('login.attempt'), {
            onFinish: () => reset('password'),
        })
    }

    return (
        <>
            <AuthLayout>
                <div className="flex flex-col flex-1">
                    <div className="w-full max-w-md pt-10 mx-auto">
                        <Link className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            href="/" data-discover="true"
                        >
                            PT Adi Bintan Permata
                        </Link>
                    </div>
                    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                        <div>
                            <div className="mb-5 sm:mb-8">
                                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                    Login To Your Account
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Please enter your details to login.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <Label htmlFor={"email"}>
                                        Email <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <InputField
                                        id="email"
                                        type="email" 
                                        placeholder="info@gmail.com" 
                                        value={data.email} 
                                        onChange={(e) => setData("email", e.target.value)} 
                                        error={errors.email ? true : false}
                                        hint={errors.email}
                                    />
                                </div>

                                <div className="mb-6">
                                    <Label htmlFor={"password"}>
                                        Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <InputField
                                            id="password"
                                            placeholder="Enter your password"
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => setData("password", e.target.value)}
                                            error={errors.password ? true : false}
                                            hint={errors.password}
                                        />

                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="dark:text-white" />
                                            ) : (
                                                <EyeOff className="dark:text-white" />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <Checkbox 
                                            checked={isChecked} 
                                            onChange={(value) => {
                                                setIsChecked(value)
                                                setData("remember", value)
                                            }}
                                            id="remember"
                                            name="remember"
                                        />

                                        <span className="block font-normal text-gray-700 text-theme-sm dark:text-white">
                                            Keep me logged in
                                        </span>
                                    </div>

                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <Button className="w-full dark:bg-[#C9262C]" size="sm" variant="primary" type="submit" disabled={processing}>
                                    Login
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        </>
    );
}
