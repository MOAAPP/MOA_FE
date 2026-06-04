import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MobileScreen from "../../components/layout/MobileScreen";
import BottomNavBar from "../../components/layout/BottomNavBar";
import "./StudyStartPage.css";

const PUZZLE_ITEMS = [
	{
	  id: "vowel",
	  label: "모음",
	  labelX: 95,
	  labelY: 68,
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
	  labelX: 283,
	  labelY: 68,
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
      <div className="study-scroll">
        <header className="study-header">
          <h1 className="study-title">
            어떤 발음을
            <br />
            모아볼까요?
          </h1>

          <div className="recommend-card">
            <span className="recommend-badge">오늘 추천 조각</span>

            <p className="recommend-text">
              처음이라면 모음부터 시작해보세요
            </p>

            <p className="recommend-sub">
              입모양을 먼저 익히면 단어와 문장 연습이 더 쉬워져요
            </p>

            <button
              type="button"
              className="recommend-start-btn"
              onClick={() => navigate("/study/vowel")}
            >
              모음 학습 시작하기
            </button>
          </div>
        </header>

        <section className="puzzle-section">
          <h2 className="puzzle-section-title">발음 퍼즐 선택</h2>

          <p className="puzzle-section-desc">
            오늘 필요한 조각부터 고르고, 하나씩 맞추며 학습을 이어가요
          </p>

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
                      y={puzzle.labelY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {puzzle.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>
      </div>

      {selectedPuzzle && (
        <div className="study-action-area">
          <button
            type="button"
            className="main-start-btn"
            onClick={() => navigate(`/study/${selectedPuzzle}`)}
          >
            시작하기
          </button>
        </div>
      )}

      <BottomNavBar activeNav="study" />
    </MobileScreen>
  );
}

export default StudyStartPage;