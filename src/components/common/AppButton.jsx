import "./AppButton.css";

function AppButton({ children, type = "button", variant = "primary", onClick, disabled = false, className = "" }) {
  return (
    <button
      type={type}
      className={`app-button app-button--${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default AppButton;
