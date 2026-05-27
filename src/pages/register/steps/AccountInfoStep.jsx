import { useState } from "react";
import AppInput from "../../../components/common/AppInput";
import { checkDuplicateId } from "../../../api/auth";
import "./AccountInfoStep.css";

function AccountInfoStep({ value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [idChecked, setIdChecked] = useState(false);
  const [idError, setIdError] = useState("");
  const [checkingId, setCheckingId] = useState(false);

  function handleChange(field, fieldValue) {
    if (field === "userId") setIdChecked(false);
    onChange({ ...value, [field]: fieldValue });
  }

  async function handleCheckId() {
    if (!value.userId?.trim()) {
      setIdError("아이디를 입력해 주세요.");
      return;
    }
    setIdError("");
    setCheckingId(true);
    try {
      await checkDuplicateId(value.userId);
      setIdChecked(true);
    } catch (err) {
      setIdError(err.message ?? "이미 사용 중인 아이디입니다.");
    } finally {
      setCheckingId(false);
    }
  }

  const passwordMismatch =
    value.passwordConfirm && value.password !== value.passwordConfirm
      ? "비밀번호가 일치하지 않습니다."
      : "";

  return (
    <div className="step-content account-info">
      <div className="step-header">
        <h1 className="step-title">계정 정보를 입력해 주세요</h1>
        <p className="step-subtitle">MOA에서 사용할 계정을 만들어주세요</p>
      </div>

      <div className="account-info-fields">
        <div className="app-input-group">
          <label htmlFor="userId" className="app-input-label">아이디</label>
          <div className="basic-info-with-btn">
            <div className={`app-input-row basic-info-input-flex${idError ? " app-input-row--error" : ""}`}>
              <input
                id="userId"
                type="text"
                value={value.userId ?? ""}
                onChange={(e) => handleChange("userId", e.target.value)}
                placeholder="아이디를 입력해주세요"
                className="app-input"
              />
              {idChecked && <CheckIcon />}
            </div>
            <button
              type="button"
              className={`basic-info-action-btn${idChecked ? " basic-info-action-btn--sent" : ""}`}
              onClick={handleCheckId}
              disabled={checkingId || idChecked}
            >
              {checkingId ? "확인 중" : idChecked ? "확인됨" : "중복확인"}
            </button>
          </div>
          {idError && <p className="app-input-error">{idError}</p>}
        </div>

        <AppInput
          id="password"
          label="비밀번호"
          type={showPassword ? "text" : "password"}
          value={value.password ?? ""}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="비밀번호를 입력해주세요"
          hint="영문, 숫자, 특수문자를 포함 8자 이상"
          rightAction={
            <button
              type="button"
              className="login-eye-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? <EyeOnIcon /> : <EyeOffIcon />}
            </button>
          }
        />

        <AppInput
          id="passwordConfirm"
          label="비밀번호 확인"
          type={showConfirm ? "text" : "password"}
          value={value.passwordConfirm ?? ""}
          onChange={(e) => handleChange("passwordConfirm", e.target.value)}
          placeholder="비밀번호를 다시 입력해주세요"
          error={passwordMismatch}
          rightAction={
            <button
              type="button"
              className="login-eye-btn"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showConfirm ? <EyeOnIcon /> : <EyeOffIcon />}
            </button>
          }
        />
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function EyeOnIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default AccountInfoStep;
