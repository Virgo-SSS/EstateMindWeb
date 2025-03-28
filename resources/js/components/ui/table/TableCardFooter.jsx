import { MoveLeft, MoveRight } from "lucide-react";

export default function TableCardFooter({ children }) {
    return (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/[0.05]">
            {children}
        </div>
    )
}