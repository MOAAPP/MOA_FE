import { useState } from "react";
import AppInput from "../../../components/common/AppInput";
import DatePickerModal from "../../../components/register/DatePickerModal";
import "./BasicInfoStep.css";

function formatDate({ year, month, day }) {
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}.${m}.${d}`;
}

function BasicInfoStep({ value, onChange }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  function handleChange(field, fieldValue) {
    onChange({ ...value, [field]: fieldValue });
  }

  function handleDateConfirm(date) {
    handleChange("birthDate", date);
    setShowDatePicker(false);
  }

  function handlePhoneVerification() {
    if (!value.phone?.trim()) return;
    setVerificationSent(true);
  }

  return (
    <div className="step-content basic-info">
      <div className="step-header">
        <h1 className="step-title">기본 정보를 입력해 주세요</h1>
        <p className="step-subtitle">학습을 시작하기 위한 정보를 입력해주세요</p>
      </div>

      <div className="basic-info-fields">
        <AppInput
          id="name"
          label="이름"
          value={value.name ?? ""}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="이름을 입력해주세요"
        />

        <div className="app-input-group">
          <label htmlFor="birthDate" className="app-input-label">생년월일</label>
          <button
            id="birthDate"
            type="button"
            className={`basic-info-date-btn${value.birthDate ? " basic-info-date-btn--filled" : ""}`}
            onClick={() => setShowDatePicker(true)}
          >
            <span className={value.birthDate ? "basic-info-date-value" : "basic-info-date-placeholder"}>
              {value.birthDate ? formatDate(value.birthDate) : "YYYY.MM.DD"}
            </span>
            <CalendarIcon />
          </button>
        </div>

        <div className="app-input-group">
          <label htmlFor="phone" className="app-input-label">전화번호</label>
          <div className="basic-info-with-btn">
            <div className="app-input-row basic-info-input-flex">
              <input
                id="phone"
                type="tel"
                value={value.phone ?? ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="전화번호를 입력해주세요"
                className="app-input"
              />
            </div>
            <button
              type="button"
              className={`basic-info-action-btn${verificationSent ? " basic-info-action-btn--sent" : ""}`}
              onClick={handlePhoneVerification}
              disabled={verificationSent}
            >
              {verificationSent ? "전송됨" : "인증 요청"}
            </button>
          </div>
        </div>

        <AppInput
          id="email"
          label="이메일"
          type="email"
          value={value.email ?? ""}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="이메일 주소를 입력해주세요"
        />
      </div>

      {showDatePicker && (
        <DatePickerModal
          value={value.birthDate}
          onConfirm={handleDateConfirm}
          onCancel={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export default BasicInfoStep;
