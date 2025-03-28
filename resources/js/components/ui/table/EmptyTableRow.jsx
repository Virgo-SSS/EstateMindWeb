export default function EmptyTableRow() {
    return (
        <tr className="h-16 border-b border-gray-200 dark:border-gray-700">
            <td colSpan="7" className="text-center text-gray-500 dark:text-gray-400">
                No data available
            </td>
        </tr>
    );
}