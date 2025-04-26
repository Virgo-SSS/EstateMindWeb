export default function TableHeader({ children, className }) {
  return (
    <thead
      className={`border-b border-gray-100 dark:border-white/[0.05] ${className}`}
    >
      {children}
    </thead>
  );
}
