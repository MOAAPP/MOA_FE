import { useMemo, useState } from "react";
import MobileScreen from "../../components/layout/MobileScreen";
import PuzzleSummaryCard from "../../components/record/PuzzleSummaryCard";
import TodayPuzzleCard from "../../components/record/TodayPuzzleCard";

import arrowLeft from "../../assets/images/record/left_side.svg";
import arrowRight from "../../assets/images/record/right_side.svg";
import allPuzzle from "../../assets/images/record/all_Puzzle.png";
import lockImage from "../../assets/images/record/lock.png";
import otherImage from "../../assets/images/record/other.png";
import reviveImage1 from "../../assets/images/record/rivive1.png"
import reviveImage2 from "../../assets/images/record/rivive2.png"
import reviveImage3 from "../../assets/images/record/rivive3.png"

import "./RecordPage2.css";

const YEAR = 2026;
const COLS = 7;

const MONTH_DATA = {
  // 4: {
  //   puzzleImage: allPuzzle,
  // },
  5: {
    puzzleImage: allPuzzle,
  },
  6: {
    puzzleImage: allPuzzle,
  },
  7: {
    puzzleImage: allPuzzle,
  },
};

const REVIVE_IMAGES = [reviveImage1, reviveImage2, reviveImage3];

function getReviveImage(day) {
  return REVIVE_IMAGES[day % REVIVE_IMAGES.length];
}

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

function compareYearMonth(yearA, monthA, yearB, monthB) {
  if (yearA !== yearB) return yearA - yearB;
  return monthA - monthB;
}

function getCellStatus(year, month, day, today, learnedDays) {
  if (!day) return "empty";

  if (learnedDays.includes(day)) {
    return "learned";
  }

  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  const compare = compareYearMonth(year, month, todayYear, todayMonth);

  if (compare > 0) return "locked"; // 미래 달
  if (compare < 0) return "missed"; // 지난 달인데 학습 안 함

  if (day > todayDate) return "locked"; // 아직 안 온 날짜
  return "missed"; // 오늘 포함, 날짜는 됐는데 학습 안 함
}
/**
 * 모든 조각이 서로 맞물리도록
 * 세로/가로 경계 방향을 한 번만 정해두는 함수
 */
function createPuzzleEdges(rows, cols) {
  const verticalEdges = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols - 1 }, (_, col) =>
      (row + col) % 2 === 0 ? 1 : -1
    )
  );

  const horizontalEdges = Array.from({ length: rows - 1 }, (_, row) =>
    Array.from({ length: cols }, (_, col) =>
      (row + col) % 2 === 0 ? 1 : -1
    )
  );

  return { verticalEdges, horizontalEdges };
}

function makeVerticalPuzzleLine(colBoundary, row, cellW, cellH, dir) {
  const x = colBoundary * cellW;
  const y = row * cellH;

  const knob = Math.min(cellW, cellH) * 0.17;
  const depth = Math.min(cellW, cellH) * 0.13;
  const midY = y + cellH / 2;

  return `
    M ${x} ${y}
    V ${midY - knob}
    C ${x + depth * dir} ${midY - knob},
      ${x + depth * dir} ${midY + knob},
      ${x} ${midY + knob}
    V ${y + cellH}
  `;
}

function makeHorizontalPuzzleLine(rowBoundary, col, cellW, cellH, dir) {
  const x = col * cellW;
  const y = rowBoundary * cellH;

  const knob = Math.min(cellW, cellH) * 0.17;
  const depth = Math.min(cellW, cellH) * 0.13;
  const midX = x + cellW / 2;

  return `
    M ${x} ${y}
    H ${midX - knob}
    C ${midX - knob} ${y + depth * dir},
      ${midX + knob} ${y + depth * dir},
      ${midX + knob} ${y}
    H ${x + cellW}
  `;
}

/**
 * 각 칸의 실제 퍼즐 조각 모양 path
 * open / locked / empty 전부 이 path로 잘림
 */
function makePuzzleCellPath(
  row,
  col,
  cellW,
  cellH,
  rows,
  verticalEdges,
  horizontalEdges
) {
  const x = col * cellW;
  const y = row * cellH;
  const w = cellW;
  const h = cellH;

  const knob = Math.min(w, h) * 0.17;
  const depth = Math.min(w, h) * 0.13;

  const midX = x + w / 2;
  const midY = y + h / 2;

  const topDir = row > 0 ? horizontalEdges[row - 1][col] : 0;
  const rightDir = col < COLS - 1 ? verticalEdges[row][col] : 0;
  const bottomDir = row < rows - 1 ? horizontalEdges[row][col] : 0;
  const leftDir = col > 0 ? verticalEdges[row][col - 1] : 0;

  let d = `M ${x} ${y}`;

  // top
  d += ` H ${midX - knob}`;
  if (topDir !== 0) {
    d += ` C ${midX - knob} ${y + depth * topDir},
             ${midX + knob} ${y + depth * topDir},
             ${midX + knob} ${y}`;
  }
  d += ` H ${x + w}`;

  // right
  d += ` V ${midY - knob}`;
  if (rightDir !== 0) {
    d += ` C ${x + w + depth * rightDir} ${midY - knob},
             ${x + w + depth * rightDir} ${midY + knob},
             ${x + w} ${midY + knob}`;
  }
  d += ` V ${y + h}`;

  // bottom
  d += ` H ${midX + knob}`;
  if (bottomDir !== 0) {
    d += ` C ${midX + knob} ${y + h + depth * bottomDir},
             ${midX - knob} ${y + h + depth * bottomDir},
             ${midX - knob} ${y + h}`;
  }
  d += ` H ${x}`;

  // left
  d += ` V ${midY + knob}`;
  if (leftDir !== 0) {
    d += ` C ${x + depth * leftDir} ${midY + knob},
             ${x + depth * leftDir} ${midY - knob},
             ${x} ${midY - knob}`;
  }
  d += ` V ${y}`;

  d += " Z";
  return d;
}

function RecordPage() {
  //학습한 날짜 데이터(mvp > 프가 관리)
  const learnedDaysByMonth = {
    5: [1,3,5],
    //5: [5, 6, 8, 10, 12, 15, 18, 20, 22, 24, 26, 27, 29, 30, 31],
    6: [],
    7: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  };

  const [month, setMonth] = useState(6);
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);

  const monthData = MONTH_DATA[month];
  const calendarCells = useMemo(() => getCalendarCells(YEAR, month), [month]);

  const totalDays = getDaysInMonth(YEAR, month);
  const rows = Math.ceil(calendarCells.length / 7);

  const viewWidth = 376;
  const viewHeight = 292;
  const cellW = viewWidth / 7;
  const cellH = viewHeight / rows;

  const { verticalEdges, horizontalEdges } = useMemo(
    () => createPuzzleEdges(rows, COLS),
    [rows]
  );

  const today = new Date();

  // 테스트용으로 날짜 고정하고 싶으면 위 today 대신
  // const today = new Date(2026, 5, 16); // 2026년 6월 16일

  const learnedDays = learnedDaysByMonth[month] ?? [];

  const learnedCount = learnedDays.length;
  const totalCount = totalDays;
  const emptyCount = totalCount - learnedCount;
  const completionRate = Math.round((learnedCount / totalCount) * 100);
  const progressPercent = completionRate;

  const handlePrevMonth = () => {
  setSelectedPuzzle(null);
  setMonth((prev) => (prev === 5 ? 7 : prev - 1));
};

const handleNextMonth = () => {
  setSelectedPuzzle(null);
  setMonth((prev) => (prev === 7 ? 5 : prev + 1));
};

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

        <div className="record-calendar-area">
          <svg
            className="record-puzzle-svg"
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              {calendarCells.map((cell) => (
                <clipPath
                  id={`cell-clip-${month}-${cell.index}`}
                  key={`clip-${cell.index}`}
                >
                  <path
                    d={makePuzzleCellPath(
                      cell.row,
                      cell.col,
                      cellW,
                      cellH,
                      rows,
                      verticalEdges,
                      horizontalEdges
                    )}
                  />
                </clipPath>
              ))}
            </defs>

            {/* 각 칸 내용 */}
            {calendarCells.map((cell) => {
              const status = getCellStatus(YEAR, month, cell.day, today, learnedDays);
              const x = cell.col * cellW;
              const y = cell.row * cellH;
              const clipId = `url(#cell-clip-${month}-${cell.index})`;

              if (status === "learned") {
                return (
                  <image
                    key={`learned-${cell.index}`}
                    href={monthData.puzzleImage}
                    x="0"
                    y="0"
                    width={viewWidth}
                    height={viewHeight}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={clipId}
                  />
                );
              }

              if (status === "locked") {
                return (
                  <g key={`locked-${cell.index}`} clipPath={clipId}>
                    <rect
                      x={x - 8}
                      y={y - 8}
                      width={cellW + 16}
                      height={cellH + 16}
                      fill="#dfe5ff"
                    />
                    <image
                      href={lockImage}
                      x={x - 8}
                      y={y - 8}
                      width={cellW + 16}
                      height={cellH + 16}
                      preserveAspectRatio="xMidYMid slice"
                    />
                  </g>
                );
              }

              if (status === "missed") {
                const reviveImage = getReviveImage(cell.day);

                return (
                  <g key={`missed-${cell.index}`} clipPath={clipId}>
                    <rect
                      x={x - 10}
                      y={y - 8}
                      width={cellW + 20}
                      height={cellH + 16}
                      fill="lightgray"
                    />

                    <image
                      href={reviveImage}
                      x={x - 10}
                      y={y - 8}
                      width={cellW + 20}
                      height={cellH + 16}
                      preserveAspectRatio="xMidYMid slice"
                      opacity="0.92"
                    />

                    {/* 회색 블러 오버레이 */}
                    <rect
                      x={x - 10}
                      y={y - 8}
                      width={cellW + 20}
                      height={cellH + 16}
                      fill="#273a73"
                      opacity="0.10"
                    />

                    <text
                      x={x + cellW / 2}
                      y={y + cellH - 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="8"
                      fontWeight="400"
                      fontFamily="Pretendard"
                      fill="#000"
                      stroke="#f7f9ff"
                      strokeWidth="1"
                      paintOrder="stroke"
                    >
                      되살리기
                    </text>
                  </g>
                );
              }

              return (
                <g key={`empty-${cell.index}`} clipPath={clipId}>
                  <rect
                    x={x - 8}
                    y={y - 8}
                    width={cellW + 16}
                    height={cellH + 16}
                    fill="#e5eaff"
                  />
                  <image
                    href={otherImage}
                    x={x - 8}
                    y={y - 8}
                    width={cellW + 16}
                    height={cellH + 16}
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>
              );
            })}

            {/* 세로 퍼즐 경계선 */}
            {Array.from({ length: COLS - 1 }).map((_, colIndex) =>
              Array.from({ length: rows }).map((_, rowIndex) => (
                <path
                  key={`v-${colIndex}-${rowIndex}`}
                  d={makeVerticalPuzzleLine(
                    colIndex + 1,
                    rowIndex,
                    cellW,
                    cellH,
                    verticalEdges[rowIndex][colIndex]
                  )}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))
            )}

            {/* 가로 퍼즐 경계선 */}
            {Array.from({ length: rows - 1 }).map((_, rowIndex) =>
              Array.from({ length: COLS }).map((_, colIndex) => (
                <path
                  key={`h-${rowIndex}-${colIndex}`}
                  d={makeHorizontalPuzzleLine(
                    rowIndex + 1,
                    colIndex,
                    cellW,
                    cellH,
                    horizontalEdges[rowIndex][colIndex]
                  )}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))
            )}

            {/* 바깥 테두리 */}
            <rect
              x="0"
              y="0"
              width={viewWidth}
              height={viewHeight}
              fill="none"
              stroke="rgba(255, 255, 255, 0.95)"
              strokeWidth="1.4"
            />

            {/* 날짜 숫자 */}
            {calendarCells.map((cell) => {
              if (!cell.day) return null;

              const x = cell.col * cellW;
              const y = cell.row * cellH;

              return (
                <g key={`date-${cell.index}`}>
                  <ellipse
                    cx={x + 9}
                    cy={y + 12}
                    rx="7.0045"
                    ry="6.9688"
                    fill="#d5dfff"
                    stroke="#f7f9ff"
                    strokeWidth="1"
                />
                <text
                    x={x + 9}
                    y={y + 12.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fontWeight="400"
                    fill="#3b3f46"
                    fontFamily="Pretendard"
                    >
                    {cell.day}
                </text>
                </g>
              );
            })}
            {/* 날짜 클릭 영역 */}
            {calendarCells.map((cell) => {
              if (!cell.day) return null;

              const path = makePuzzleCellPath(
                cell.row,
                cell.col,
                cellW,
                cellH,
                rows,
                verticalEdges,
                horizontalEdges
              );

              return (
                <path
                  key={`click-${cell.index}`}
                  d={path}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const status = getCellStatus(YEAR, month, cell.day, today, learnedDays);

                    setSelectedPuzzle({
                      year: YEAR,
                      month,
                      day: cell.day,
                      status,
                    });
                  }}
                />
              );
            })}
          </svg>
        </div>

        <div className="record-progress-row">
          <div className="record-progress-bar">
            <div
              className="record-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span>
            {learnedCount}/{totalCount} 획득
          </span>
        </div>
      </section>

    <div className="record-summary-row">
      <PuzzleSummaryCard label="학습한 조각" value={`${learnedCount}일`} />
      <PuzzleSummaryCard label="빈 조각" value={`${emptyCount}개`} />
      <PuzzleSummaryCard label="완성률" value={`${completionRate}%`} />
    </div>


    <TodayPuzzleCard selectedPuzzle={selectedPuzzle} />

    </MobileScreen>
  );
}

export default RecordPage;