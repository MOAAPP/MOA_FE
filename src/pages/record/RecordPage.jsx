import MobileScreen from "../../components/layout/MobileScreen";
import arrowLeft from "../../assets/images/record/left_side.svg";
import arrowRight from "../../assets/images/record/right_side.svg";
import "./RecordPage.css";

function RecordPage() {
  return (
    <MobileScreen className="record-page">
      <section className="record-calendar-card">
        <div className="record-calendar-header">
          <div>
            <h2>2026년 5월</h2>
            <p>오늘의 학습으로 퍼즐을 완성해보세요</p>
          </div>

          <div className="record-month-buttons">
            <button type="button" aria-label="이전 달">
                <img src={arrowLeft} alt="" />
            </button>
            <button type="button" aria-label="다음 달">
                <img src={arrowRight} alt="" />
            </button>
          </div>
        </div>

        <div className="record-week-row">
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span>토</span>
          <span>일</span>
        </div>

        <div className="record-calendar-area">
          <div className="record-calendar-grid">
            {Array.from({ length: 35 }).map((_, index) => (
              <div className="record-date-cell" key={index}>
                <span>{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="record-progress-row">
          <div className="record-progress-bar">
            <div className="record-progress-fill" />
          </div>
          <span>16/31 획득</span>
        </div>
      </section>
    </MobileScreen>
  );
}

export default RecordPage;