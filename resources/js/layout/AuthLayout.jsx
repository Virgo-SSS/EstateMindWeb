import React from "react"
import ThemeTogglerTwo from "../components/common/ThemeTogglerTwo"
import { ThemeProvider } from "../context/ThemeContext"
import { Link } from "@inertiajs/react"

export default function AuthLayout({ children }) {
    return (
        <ThemeProvider>
            <div className="relative p-6 z-1 bg-[#f7f7f7] dark:bg-gray-900 sm:p-0">
                <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row sm:p-0">
                    <div className="flex flex-col flex-1">
                        <div className="w-full max-w-md pt-10 mx-auto">
                            <Link className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                href={route("dashboard")} data-discover="true"
                            >
                                PT Adi Bintan Permata
                            </Link>
                        </div>
                        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                            {children}
                        </div>
                    </div>
                    <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                        <ThemeTogglerTwo />
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}
