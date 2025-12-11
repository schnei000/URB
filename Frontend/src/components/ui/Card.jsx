import PropTypes from 'prop-types';

export default function Card({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  icon,
  iconPosition = "left",
  className = ""
}) {
  const inputClasses = error ? "input-error" : "input-field";
  const iconPaddingClass = icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "";

  return (
    <div className="input-group">
      {/* Label */}
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className={`absolute ${iconPosition === "left" ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400`}>
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`${inputClasses} ${iconPaddingClass} ${className}`}
        />
      </div>

      {/* Helper Text or Error */}
      {(helperText || error) && (
        <p className={`text-sm mt-1 ${error ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  className: PropTypes.string
};