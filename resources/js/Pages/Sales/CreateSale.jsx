import { Link } from "@inertiajs/react";
import AppLayout from "../../layout/AppLayout";

export default function CreateSale() {
    return (
        <>
            <AppLayout>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <Link
                        href={route("sales.index")}
                        className="text-xl font-semibold text-gray-800 dark:text-white/90"
                    >
                        Sales
                    </Link>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] w-2/3 mx-auto">
                        <div className="px-6 py-5">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                                Create Sale
                            </h3>
                        </div>
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                            <div className="space-y-6">
                                {/* Form goes here */}
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
    