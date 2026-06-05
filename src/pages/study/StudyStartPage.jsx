import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MobileScreen from "../../components/layout/MobileScreen";
import BottomNavBar from "../../components/layout/BottomNavBar";
import "./StudyStartPage.css";

const PUZZLE_ITEMS = [
  {
    id: "vowel",
    label: "모음",
    description: "입모양 기초",
    labelX: 95,
    labelY: 65,
    path: `
      M 14 1
      H 189
      V 43
      C 189 51, 203 51, 203 67
      C 203 83, 189 83, 189 91
      V 134
      H 135
      C 128 134, 126 150, 110 150
      C 94 150, 92 134, 85 134
      H 1
      V 14
      Q 1 1, 14 1
      Z
    `,
  },
  {
    id: "syllable",
    label: "음절",
    description: "소리 연결",
    labelX: 283,
    labelY: 65,
    path: `
      M 189 1
      H 364
      Q 377 1, 377 14
      V 134
      H 293
      C 286 134, 284 118, 268 118
      C 252 118, 250 134, 243 134
      H 189
      V 91
      C 189 83, 203 83, 203 67
      C 203 51, 189 51, 189 43
      Z
    `,
  },
  {
    id: "word",
    label: "단어",
    description: "단어 발음",
    labelX: 95,
    labelY: 201,
    path: `
      M 1 134
      H 85
      C 92 134, 94 150, 110 150
      C 126 150, 128 134, 135 134
      H 189
      V 181
      C 189 188, 179 191, 179 201
      C 179 211, 189 214, 189 221
      V 267
      H 14
      Q 1 267, 1 254
      V 134
      Z
    `,
  },
  {
    id: "sentence",
    label: "문장",
    description: "문장 연습",
    labelX: 283,
    labelY: 201,
    path: `
      M 189 134
      H 243
      C 250 134, 252 118, 268 118
      C 284 118, 286 134, 293 134
      H 377
      V 254
      Q 377 267, 364 267
      H 189
      V 221
      C 189 214, 179 211, 179 201
      C 179 191, 189 188, 189 181
      Z
    `,
  },
];

function StudyStartPage() {
  const navigate = useNavigate();
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);

  function handlePuzzleSelect(puzzleId) {
    setSelectedPuzzle(puzzleId);
  }

  function handlePuzzleKeyDown(event, puzzleId) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handlePuzzleSelect(puzzleId);
    }
  }

  return (
    <MobileScreen className="study-page">
      <div className="study-bg-decoration study-bg-decoration-1" />
      <div className="study-bg-decoration study-bg-decoration-2" />

      <div className="study-scroll">
        <header className="study-header">
          <p className="study-eyebrow">MOA Learning</p>

          <h1 className="study-title">
            어떤 발음을
            <br />
            모아볼까요?
          </h1>
        </header>

        <section className="recommend-card">
          <div className="recommend-top">
            <span className="recommend-badge">오늘 추천 조각</span>
            <span className="recommend-small-label">STEP 01</span>
          </div>

          <p className="recommend-text">
            처음이라면 모음부터
            <br />
            시작해보세요
          </p>

          <p className="recommend-sub">
            입모양을 먼저 익히면 단어와 문장 연습이 더 쉬워져요.
          </p>

          <button
            type="button"
            className="recommend-start-btn"
            onClick={() => navigate("/study/vowel")}
          >
            모음 학습 시작하기
          </button>
        </section>

        <section className="puzzle-section">
          <div className="puzzle-section-header">
            <div>
              <h2 className="puzzle-section-title">발음 퍼즐 선택</h2>

              <p className="puzzle-section-desc">
                오늘 필요한 조각부터 골라 학습을 이어가요
              </p>
            </div>

            {selectedPuzzle && (
              <span className="puzzle-selected-chip">
                선택 완료
              </span>
            )}
          </div>

          <div className="puzzle-card">
            <div className="puzzle-board">
              <svg
                className="puzzle-board-svg"
                viewBox="0 0 378 268"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="발음 퍼즐 선택"
              >
                {PUZZLE_ITEMS.map((puzzle) => {
                  const isSelected = selectedPuzzle === puzzle.id;

                  return (
                    <g
                      key={puzzle.id}
                      className={`puzzle-group${
                        isSelected ? " puzzle-group--selected" : ""
                      }`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${puzzle.label} 학습 선택`}
                      aria-pressed={isSelected}
                      onClick={() => handlePuzzleSelect(puzzle.id)}
                      onKeyDown={(event) =>
                        handlePuzzleKeyDown(event, puzzle.id)
                      }
                    >
                      <path className="puzzle-shape" d={puzzle.path} />

                      <text
                        className="puzzle-label"
                        x={puzzle.labelX}
                        y={puzzle.labelY - 6}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {puzzle.label}
                      </text>

                      <text
                        className="puzzle-description"
                        x={puzzle.labelX}
                        y={puzzle.labelY + 25}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {puzzle.description}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </section>
      </div>

      <div className={`study-action-area${selectedPuzzle ? " show" : ""}`}>
        <button
          type="button"
          className="main-start-btn"
          disabled={!selectedPuzzle}
          onClick={() => selectedPuzzle && navigate(`/study/${selectedPuzzle}`)}
        >
          {selectedPuzzle ? "선택한 발음 시작하기" : "퍼즐을 선택해주세요"}
        </button>
      </div>

      <BottomNavBar activeNav="study" />
    </MobileScreen>
  );
}

export default StudyStartPage;