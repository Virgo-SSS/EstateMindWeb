export default function Table ({ children, className }) {
	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/[0.09]">
			<div className="max-w-full overflow-x-auto">
				<table className={`min-w-full ${className}`}>{children}</table>
			</div>
		</div>
	)
}