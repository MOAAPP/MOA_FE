import { useNavigate } from "react-router-dom";
import "./StudyCompletePage.css";
import bgImage from "../../assets/images/study/resultbg.png";

const PuzzleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="199" height="199" viewBox="0 0 199 199" fill="none">
    <path d="M25.25 0.5H173.75C190.25 0.5 198.5 8.75 198.5 25.25V58.25C198.5 74.75 173.75 70.625 173.75 99.5C173.75 128.375 198.5 124.25 198.5 140.75V173.75C198.5 190.25 190.25 198.5 173.75 198.5H25.25C8.75 198.5 0.5 190.25 0.5 173.75V140.75C0.5 124.25 25.25 128.375 25.25 99.5C25.25 70.625 0.5 74.75 0.5 58.25V25.25C0.5 8.75 8.75 0.5 25.25 0.5Z" fill="#5681FF" stroke="#111827" strokeOpacity="0.04"/>
  </svg>
);

function StudyCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="sc-container">
      {/* 배경 이미지 */}
      <div className="sc-bg" style={{ backgroundImage: `url(${bgImage})` }} />

      {/* 퍼즐 아이콘 + 숫자 */}
      <div className="sc-puzzle-wrap">
        <div className="sc-puzzle-icon">
          <PuzzleIcon />
          <span className="sc-puzzle-number">3</span>
        </div>
      </div>

      {/* 텍스트 영역 */}
      <div className="sc-text-wrap">
        <h1 className="sc-title">오늘의 퍼즐 획득!</h1>
        <p className="sc-desc">
          첫 학습 완료로 조각 1개를 얻었어요<br />
          내일도 학습하면 새로운 조각을 받을 수 있어요
        </p>
        <div className="sc-streak-badge">3일 연속 학습 이어가는 중</div>
      </div>

      {/* 하단 버튼 */}
      <div className="sc-footer">
        <button className="sc-btn-home" onClick={() => navigate("/")}>
          홈으로
        </button>
        <button className="sc-btn-analysis" onClick={() => navigate("/analysis")}>
          분석 시작하기 <span className="sc-btn-arrow">›</span>
        </button>
      </div>
    </div>
  );
}

export default StudyCompletePage;
