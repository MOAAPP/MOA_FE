import calendarIcon from "../../assets/images/record/ci_calendar.svg";
import otherGuideImage from "../../assets/images/record/otherimg.png";
import LearningRecordCard from "./LearningRecordCard";
import "./TodayPuzzleCard.css";

function TodayPuzzleCard({ selectedPuzzle }) {
  const hasSelectedPuzzle = selectedPuzzle !== null;

  const today = new Date();

  const month = selectedPuzzle?.month;
  const day = selectedPuzzle?.day;
  const status = selectedPuzzle?.status;

  const displayMonth = hasSelectedPuzzle ? month : today.getMonth() + 1;
  const displayDay = hasSelectedPuzzle ? day : today.getDate();
  
  //상태 확인
  const isLocked = status === "locked";
  const isMissed = status === "missed";
  const isLearned = status === "learned";
  const isOther = status === "other";
  const isToday = status === "today";

  if (isOther) {
    return (
      <section className="today-puzzle-card is-other">
        <div className="today-puzzle-other-content">
          <div className="today-puzzle-other-text">
            <h3>
              모든 퍼즐을 모으면
              <br />
              마지막 조각이 완성돼요
            </h3>
          </div>

          <div className="today-puzzle-other-figure">
            <img src={otherGuideImage} alt="" />
          </div>
        </div>
      </section>
    );
  }

  if (isLearned) {
    const records = [
      {
        label: "모음 · ㅏ",
        feedback: "입술 닫힘 강도를 한 번 더 맞춰보면 좋아요",
      },
      {
        label: "모음 · ㅗ",
        feedback: "입술 닫힘 강도를 한 번 더 맞춰보면 좋아요",
      },
    ];

    return (
      <LearningRecordCard
        month={displayMonth}
        day={displayDay}
        records={records}
      />
    );
  }

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