export default function Select({ options, value, onChange, placeholder, className }) {
    return (
        <select
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-60 h-11 appearance-none rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 text-gray-400 border-gray-300 bg-transparentpr-11focus:border-brand-300  focus:ring-brand-500/10 dark:border-gray-700 ${className}`} 
        >
            {options.map((option, index) => (
                <option key={index} value={option.value} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                    {option.label}
                </option>
            ))}
        </select>
            
        
    )
}