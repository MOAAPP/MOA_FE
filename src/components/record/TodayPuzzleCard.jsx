import "./TodayPuzzleCard.css";
import calendarIcon from "../../assets/images/record/ci_calendar.svg"

function TodayPuzzleCard() {
  return (
    <section className="today-puzzle-card">
      <div className="today-puzzle-date-badge">
        <img
            className="today-puzzle-calendar-icon"
            src={calendarIcon}
            alt=""
        />
        <span>3월 28일</span>
      </div>

      <div className="today-puzzle-content">
        <h3>오늘 채울 수 있는 조각</h3>
        <p>
          아직 학습하지 않았어요
          <br />
          지금 학습하면 퍼즐이 채워져요
        </p>
      </div>

      <button type="button" className="today-puzzle-button">
        오늘 채우기
      </button>
    </section>
  );
}

export default TodayPuzzleCard;