export default function TableHeaderCell({ children, className }) {
  return (
    <th
      className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ${className}`}
    >
      {children}
    </th>
  );
}
