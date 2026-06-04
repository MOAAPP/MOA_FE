import "./RegisterStepHeader.css";

function RegisterStepHeader({ title, subtitle }) {
  return (
    <div className="register-step-header">
      <h1 className="register-step-title">{title}</h1>
      <p className="register-step-subtitle">{subtitle}</p>
    </div>
  );
}

export default RegisterStepHeader;