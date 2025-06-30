export default function Select({
  id,
  name,
  options,
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
  required = false,
  hint,
  error = false,
  success = false,
}) {
  const disabledOptionClass =
    "text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600";
  const enabledOptionClass =
    "text-gray-700 dark:text-gray-400 dark:bg-gray-900";

  let inputClasses = `w-full h-11 appearance-none rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 pr-11 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`;
  } else if (error) {
    inputClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += `  border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`;
  }

  return (
    <>
      <select
        disabled={disabled}
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClasses}
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value}
            disabled={option.disabled}
            className={`${
              option.disabled ? disabledOptionClass : enabledOptionClass
            }`}
          >
            {option.label}
          </option>
        ))}
      </select>

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </>
  );
}
