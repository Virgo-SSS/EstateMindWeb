import { SquareArrowDown } from "lucide-react";
import AppLayout from "../layout/AppLayout";

export default function Dashboard() {
    return (
        <>
            <AppLayout>
                <div className="flex items-center justify-center h-[calc(95vh-80px)]">
                    <div className={` mx-auto mb-10 w-full max-w-60 rounded-2xl py-5 text-center`}>
                        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                            Predict House Sales            
                        </h3>
                        <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
                            <SquareArrowDown className="inline-block mr-1" />
                        </p>
                        <a href="https://tailadmin.com/pricing" target="_blank" rel="nofollow"
                            className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600">
                            Let's Predict Sales
                        </a>
                    </div>
                </div>
            </AppLayout>
        </>
    )
}
