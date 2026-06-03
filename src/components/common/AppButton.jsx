import "./AppButton.css";

function AppButton({ children, type = "button", variant = "primary", onClick, disabled = false }) {
  return (
    <button
      type={type}
      className={`app-button app-button--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default AppButton;
