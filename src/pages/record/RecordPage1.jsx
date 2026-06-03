import { useMemo, useState } from "react";
import MobileScreen from "../../components/layout/MobileScreen";
import arrowLeft from "../../assets/images/record/left_side.svg";
import arrowRight from "../../assets/images/record/right_side.svg";
import allPuzzle from "../../assets/images/record/all_Puzzle.png";
import "./RecordPage1.css";

const YEAR = 2026;

const MONTH_DATA = {
  5: {
    puzzleImage: allPuzzle,
    acquiredCount: 31,
  },
  6: {
    puzzleImage: allPuzzle,
    acquiredCount: 30,
  },
  7: {
    puzzleImage: allPuzzle,
    acquiredCount: 31,
  },
};

function getCalendarCells(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0).getDate();

  const startDay = firstDay.getDay();
  const mondayStartIndex = startDay === 0 ? 6 : startDay - 1;

  const cells = [];

  for (let i = 0; i < mondayStartIndex; i++) {
    cells.push(null);
  }

  for (let date = 1; date <= lastDate; date++) {
    cells.push(date);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells.map((day, index) => ({
    day,
    index,
    row: Math.floor(index / 7),
    col: index % 7,
  }));
}

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function RecordPage() {
  const [month, setMonth] = useState(6);

  const monthData = MONTH_DATA[month];
  const calendarCells = useMemo(() => getCalendarCells(YEAR, month), [month]);
  const totalDays = getDaysInMonth(YEAR, month);
  const rows = Math.ceil(calendarCells.length / 7);

  const handlePrevMonth = () => {
    setMonth((prev) => (prev === 5 ? 7 : prev - 1));
  };

  const handleNextMonth = () => {
    setMonth((prev) => (prev === 7 ? 5 : prev + 1));
  };

    const isAcquiredDay = (day) => {
    return !!day;
    };

  const progressPercent = (monthData.acquiredCount / totalDays) * 100;

  return (
    <MobileScreen className="record-page">
      <section className="record-calendar-card">
        <div className="record-calendar-header">
          <div>
            <h2>
              {YEAR}년 {month}월
            </h2>
            <p>오늘의 학습으로 퍼즐을 완성해보세요</p>
          </div>

          <div className="record-month-buttons">
            <button type="button" aria-label="이전 달" onClick={handlePrevMonth}>
              <img src={arrowLeft} alt="" />
            </button>
            <button type="button" aria-label="다음 달" onClick={handleNextMonth}>
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

        <div
          className="record-calendar-area"
          style={{
            "--calendar-rows": rows,
          }}
        >
          <div className="record-calendar-grid">
            {calendarCells.map((cell) => {
              const acquired = isAcquiredDay(cell.day);

              return (
                <div
                  className={`record-date-cell ${
                    acquired ? "is-acquired" : cell.day ? "is-locked" : "is-empty"
                  }`}
                  key={cell.index}
                  style={
                    acquired
                      ? {
                          backgroundImage: `url(${monthData.puzzleImage})`,
                          backgroundSize: `620% ${rows * 100}%`,
                          backgroundPosition: `${(cell.col / 6) * 100}% ${
                            rows === 1 ? 0 : (cell.row / (rows - 1)) * 100
                          }%`,
                        }
                      : undefined
                  }
                >
                  {cell.day && (
                    <span className="record-day-number">
                      <span className="record-day-text">{cell.day}</span>
                    </span>
                  )}

                  {!acquired && cell.day && (
                    <span className="record-lock-icon">🔒</span>
                  )}

                  {!cell.day && <span className="record-empty-piece" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="record-progress-row">
          <div className="record-progress-bar">
            <div
              className="record-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span>
            {monthData.acquiredCount}/{totalDays} 획득
          </span>
        </div>
      </section>
    </MobileScreen>
  );
}

export default RecordPage;