export default function TableCardBody({ children }) {
    return (
        <div className="overflow-hidden">
            <div className="max-w-full px-5 overflow-x-auto sm:px-6">
                {children}
            </div>
        </div>
    )
}