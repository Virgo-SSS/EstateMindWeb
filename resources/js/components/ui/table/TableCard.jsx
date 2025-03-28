export default function TableCard ({ title, children, className = "", desc = "" }) {
	return (
		<div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
			{children}
		</div>
	)
}