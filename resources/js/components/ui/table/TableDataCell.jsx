export default function TableDataCell({ children, className }) {
  return (
    <td
      className={`px-4 sm:px-6 py-3.5 text-gray-700 text-theme-sm dark:text-gray-400 ${className}`}
    >
      {children}
    </td>
  );
}
