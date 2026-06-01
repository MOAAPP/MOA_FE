import "./AppButton.css";

function AppButton({
  children,
  type = "button",
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      className={`app-button ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default AppButton;