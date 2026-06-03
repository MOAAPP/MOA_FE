import { useState, useEffect, useRef } from "react";
import "./DatePickerModal.css";

const YEARS = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function getDays(year, month) {
  if (!year || !month) return Array.from({ length: 31 }, (_, i) => i + 1);
  return Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);
}

function SelectField({ label, values, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  return (
    <div className="date-picker-select-group" ref={ref}>
      <label className="date-picker-select-label">{label}</label>
      <div className={`date-picker-select-wrap${open ? " is-open" : ""}`}>
        <span className="date-picker-select-value">
          {value != null ? value : ""}
        </span>
        <button
          type="button"
          className="date-picker-chevron"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <ul className="date-picker-dropdown">
            {values.map((v) => (
              <li
                key={v}
                className={`date-picker-option${v === value ? " is-selected" : ""}`}
                onClick={() => { onChange(v); setOpen(false); }}
              >
                {v}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DatePickerModal({ value, onConfirm, onCancel }) {
  const [year, setYear] = useState(value?.year ?? null);
  const [month, setMonth] = useState(value?.month ?? null);
  const [day, setDay] = useState(value?.day ?? null);

  const days = getDays(year, month);

  useEffect(() => {
    if (day != null && day > days.length) setDay(days.length);
  }, [year, month]);

  return (
    <div className="date-picker-overlay" onClick={onCancel}>
      <div className="date-picker-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="date-picker-handle" />
        <p className="date-picker-title">생년월일 선택</p>

        <div className="date-picker-selects">
          <SelectField label="년" values={YEARS} value={year} onChange={setYear} />
          <SelectField label="월" values={MONTHS} value={month} onChange={setMonth} />
          <SelectField label="일" values={days} value={day} onChange={setDay} />
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
