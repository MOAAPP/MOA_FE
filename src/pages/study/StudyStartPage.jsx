import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNavBar from "../../components/layout/BottomNavBar";
import "./StudyStartPage.css";

const PUZZLE_COLOR_DEFAULT = "#D5E0FF";  // --blue-200
const PUZZLE_COLOR_ACTIVE = "#5681FF";   // --blue-500
const PUZZLE_STROKE = "#F7F9FF";

const puzzleList = [
	{
		id: "vowel", label: "모음", zIndex: 2,
		svg: (color) => (
			<svg width="213" height="159" viewBox="0 0 213 159" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M14.25 0.75H189.75V28.1059C189.75 37.2246 212.25 37.2246 212.25 58.8814C212.25 80.5381 189.75 80.5381 189.75 89.6568V135.25H133.5C124.5 135.25 124.5 158.047 103.125 158.047C81.7499 158.047 81.7499 135.25 72.75 135.25H0.75V14.428C0.75 5.30932 5.25 0.75 14.25 0.75Z" fill={color} stroke={PUZZLE_STROKE} strokeWidth="1.5" strokeLinejoin="round"/>
			</svg>
		)
	},
	{
		id: "syllable", label: "음절", zIndex: 3,
		svg: (color) => (
			<svg width="213" height="136" viewBox="0 0 213 136" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M23.25 0.75H198.75C207.75 0.75 212.25 5.30932 212.25 14.428V135.25H140.25C131.25 135.25 131.25 112.453 109.875 112.453C88.4999 112.453 88.4999 135.25 79.4999 135.25H23.25V89.6568C23.25 80.5381 0.75 80.5381 0.75 58.8814C0.75 37.2246 23.25 37.2246 23.25 28.1059V0.75Z" fill={color} stroke={PUZZLE_STROKE} strokeWidth="1.5" strokeLinejoin="round"/>
			</svg>
		)
	},
	{
		id: "word", label: "단어", zIndex: 5,
		svg: (color) => (
			<svg width="213" height="159" viewBox="0 0 213 159" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0.75 23.5466H72.75C81.7499 23.5466 81.7499 0.75 103.125 0.75C124.5 0.75 124.5 23.5466 133.5 23.5466H189.75V69.1398C189.75 78.2585 212.25 78.2585 212.25 99.9153C212.25 121.572 189.75 121.572 189.75 130.691V158.047H14.25C5.25 158.047 0.75 153.487 0.75 144.369V23.5466Z" fill={color} stroke={PUZZLE_STROKE} strokeWidth="1.5" strokeLinejoin="round"/>
			</svg>
		)
	},
	{
		id: "sentence", label: "문장", zIndex: 4,
		svg: (color) => (
			<svg width="213" height="159" viewBox="0 0 213 159" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M23.25 23.5466H79.4999C88.4999 23.5466 88.4999 0.75 109.875 0.75C131.25 0.75 131.25 23.5466 140.25 23.5466H212.25V158.047H23.25V130.691C23.25 121.572 0.75 121.572 0.75 99.9153C0.75 78.2585 23.25 78.2585 23.25 69.1398V23.5466Z" fill={color} stroke={PUZZLE_STROKE} strokeWidth="1.5" strokeLinejoin="round"/>
			</svg>
		)
	},
];

function StudyStartPage() {
	const navigate = useNavigate();
	const [selectedPuzzle, setSelectedPuzzle] = useState(null);

	return (
		<div className="study-container">
			{/* 헤더 */}
			<header className="study-header">
				<h1 className="study-title">어떤 발음을<br />모아볼까요?</h1>
				<div className="recommend-card">
					<span className="recommend-badge">오늘 추천 조각</span>
					<p className="recommend-text">처음이라면 모음부터 시작해보세요</p>
					<p className="recommend-sub">입모양을 먼저 익히면 단어와 문장 연습이 더 쉬워져요</p>
					<button className="recommend-start-btn" onClick={() => navigate("/study/consonant")}>
						모음 학습 시작하기
					</button>
				</div>
			</header>

			{/* 퍼즐 선택 */}
			<section className="puzzle-section">
				<h2 className="puzzle-section-title">발음 퍼즐 선택</h2>
				<p className="puzzle-section-desc">오늘 필요한 조각부터 고르고, 하나씩 맞추며 학습을 이어가요</p>

				<div className="puzzle-board">
					{puzzleList.map((puzzle) => {
						const isSelected = selectedPuzzle === puzzle.id;
						const color = isSelected ? PUZZLE_COLOR_ACTIVE : PUZZLE_COLOR_DEFAULT;
						return (
							<button
								key={puzzle.id}
								className={`puzzle-piece ${puzzle.id} ${isSelected ? "active" : ""}`}
								style={{ zIndex: puzzle.zIndex }}
								onClick={() => setSelectedPuzzle(puzzle.id)}
							>
								<span className="puzzle-svg">{puzzle.svg(color)}</span>
								<span className="puzzle-label">{puzzle.label}</span>
							</button>
						);
					})}
				</div>
			</section>

			{/* 시작 버튼 */}
			{selectedPuzzle && (
				<div className="action-button-area">
					<button
						className="main-start-btn"
						onClick={() => navigate(`/study/${selectedPuzzle}`)}
					>
						시작하기
					</button>
				</div>
			)}

			<BottomNavBar activeNav="study" />
		</div>
	);
}

export default StudyStartPage;
