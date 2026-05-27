import "./AppInput.css";

function AppInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  rightAction,
  hint,
  error,
  disabled = false,
}) {
  return (
    <div className="app-input-group">
      {label && (
        <label htmlFor={id} className="app-input-label">
          {label}
        </label>
      )}
      <div className={`app-input-row${error ? " app-input-row--error" : ""}`}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="app-input"
        />
        {rightAction && <div className="app-input-right">{rightAction}</div>}
      </div>
      {error && <p className="app-input-error">{error}</p>}
      {!error && hint && <p className="app-input-hint">{hint}</p>}
    </div>
  );
}

export default AppInput;
