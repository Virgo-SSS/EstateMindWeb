import { twMerge } from "tailwind-merge"

export default function Label({ htmlFor, children, className }) {
  return (
        <label
            htmlFor={htmlFor}
            className={twMerge(
                // Default classes that apply by default
                "mb-1.5 block text-sm font-medium text-gray-700 dark:text-white ", // User-defined className that can override the default margin
                className
            )}
        >
            {children}
        </label>
    )
}