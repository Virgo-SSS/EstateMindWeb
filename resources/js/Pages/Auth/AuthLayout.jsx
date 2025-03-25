import React from "react"
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo"
import { ThemeProvider } from "../../context/ThemeContext"

export default function AuthLayout({ children }) {
    return (
        <ThemeProvider>
            <div className="relative p-6 z-1 bg-[#f7f7f7] dark:bg-gray-900 sm:p-0">
                <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row sm:p-0">
                    {children}
                    <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                        <ThemeTogglerTwo />
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}
