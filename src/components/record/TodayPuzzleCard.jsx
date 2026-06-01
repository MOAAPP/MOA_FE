import calendarIcon from "../../assets/images/record/ci_calendar.svg";
import "./TodayPuzzleCard.css";

function TodayPuzzleCard({ selectedPuzzle }) {
  const hasSelectedPuzzle = selectedPuzzle !== null;

  const today = new Date();

  const month = selectedPuzzle?.month;
  const day = selectedPuzzle?.day;
  
  //상태 확인
  const status = selectedPuzzle?.status;
  const isLocked = status === "locked";
  const isMissed = status === "missed";
  const isLearned = status === "learned";

  const displayMonth = hasSelectedPuzzle ? month : today.getMonth() + 1;
  const displayDay = hasSelectedPuzzle ? day : today.getDate();

  return (
    <section
      className={`today-puzzle-card ${isLocked ? "is-locked" : "is-open"}`}
    >
      <div className="today-puzzle-date-badge">
        <img
          className="today-puzzle-calendar-icon"
          src={calendarIcon}
          alt=""
        />
        <span>
          {displayMonth}월 {displayDay}일
        </span>
      </div>

      <div className="today-puzzle-content">
        {isLocked ? (
          <>
            <h3>아직 열리지 않은 퍼즐이에요</h3>
            <p>해당 날짜가 되면 조각을 채울 수 있어요</p>
          </>
        ) : isMissed ? (
          <>
            <h3>놓친 조각</h3>
            <p>
              이 날은 학습하지 않아 조각을 얻지 못했어요.
              <br />
              풍선을 사용하면 이 조각을 다시 얻을 수 있어요.
            </p>
          </>
        ) : isLearned ? (
          <>
            <h3>학습한 조각이에요</h3>
            <p>해당 날짜의 학습 기록을 확인할 수 있어요</p>
          </>
        ) : (
          <>
            <h3>오늘 채울 수 있는 조각</h3>
            <p>
              아직 학습하지 않았어요
              <br />
              지금 학습하면 퍼즐이 채워져요
            </p>
          </>
        )}
      </div>

      {!isLocked && (
        <button type="button" className="today-puzzle-button">
          {isMissed
            ? "풍선 100개로 복구하기"
            : isLearned
            ? "기록 보기"
            : "오늘 채우기"}
        </button>
      )}
    </section>
  );
}

export default TodayPuzzleCard;