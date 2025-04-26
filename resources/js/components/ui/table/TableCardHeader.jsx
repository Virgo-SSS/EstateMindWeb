export default function TableCardHeader({ children }) {
  return (
    <div className="flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      {children}
    </div>
  );
}
