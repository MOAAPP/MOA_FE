import calendarIcon from "../../assets/images/record/ci_calendar.svg";
import "./LearningRecordCard.css";

function LearningRecordCard({ month, day, records = [] }) {
  return (
    <section className="learning-record-card">
      <div className="today-puzzle-date-badge">
        <img
          className="today-puzzle-calendar-icon"
          src={calendarIcon}
          alt=""
        />
        <span>
          {month}월 {day}일
        </span>
      </div>

      <h3 className="learning-record-title">{records.length}개 학습 기록</h3>

      <div className="learning-record-list">
        {records.map((record, index) => (
          <div className="learning-record-item" key={index}>
            <div className="learning-record-top">
              <span className="learning-record-badge">{record.label}</span>
              <button type="button" className="learning-record-button">
                다시 연습
              </button>
            </div>

            <p>{record.feedback}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LearningRecordCard;