import "./AppButton.css";

function AppButton({ children, type = "button", onClick }) {
  return (
    <button type={type} className="app-button" onClick={onClick}>
      {children}
    </button>
  );
}

export default AppButton;