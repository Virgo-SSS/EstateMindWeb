import { Link } from "@inertiajs/react";
import Input from "../../components/ui/input/Input"
import Label from "../../components/ui/label/Label"
import AuthLayout from "../../layout/AuthLayout";
import Button from "../../components/ui/button/Button";

export default function ForgotPassord() {
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
                                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Forgot Your Password?
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Enter the email address linked to your account, and we’ll send
                                    you a link to reset your password.</p>
                            </div>

                            <form>
                                <div className="mb-6">
                                    <Label>
                                        Email <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Input placeholder="Enter your email address" />
                                </div>

                                <Button className="w-full dark:bg-[#C9262C]" size="sm">
                                    Send Reset Link
                                </Button>
                            </form>
                            <div className="mt-5">
                                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
                                    Remember your password?{" "}
                                    <Link className="text-brand-500 hover:text-brand-600 dark:text-brand-400" href="/" data-discover="true">Click here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        </>
    );
}
