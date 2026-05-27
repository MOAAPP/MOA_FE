import { useState, useEffect } from "react";
import "./DatePickerModal.css";

const YEARS = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function DatePickerModal({ value, onConfirm, onCancel }) {
  const today = new Date();
  const [year, setYear] = useState(value?.year ?? today.getFullYear());
  const [month, setMonth] = useState(value?.month ?? today.getMonth() + 1);
  const [day, setDay] = useState(value?.day ?? today.getDate());

  const days = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);

  useEffect(() => {
    const maxDay = getDaysInMonth(year, month);
    if (day > maxDay) setDay(maxDay);
  }, [year, month, day]);

  return (
    <div className="date-picker-overlay" onClick={onCancel}>
      <div className="date-picker-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="date-picker-handle" />
        <p className="date-picker-title">생년월일 선택</p>

        <div className="date-picker-selects">
          <div className="date-picker-select-group">
            <label className="date-picker-select-label">년</label>
            <div className="date-picker-select-wrap">
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="date-picker-select"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <span className="date-picker-chevron">▾</span>
            </div>
          </div>

          <div className="date-picker-select-group">
            <label className="date-picker-select-label">월</label>
            <div className="date-picker-select-wrap">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="date-picker-select"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <span className="date-picker-chevron">▾</span>
            </div>
          </div>

          <div className="date-picker-select-group">
            <label className="date-picker-select-label">일</label>
            <div className="date-picker-select-wrap">
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="date-picker-select"
              >
                {days.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <span className="date-picker-chevron">▾</span>
            </div>
          </div>
        </div>

        <div className="date-picker-actions">
          <button type="button" className="date-picker-btn date-picker-cancel" onClick={onCancel}>
            취소
          </button>
          <button
            type="button"
            className="date-picker-btn date-picker-confirm"
            onClick={() => onConfirm({ year, month, day })}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default DatePickerModal;
