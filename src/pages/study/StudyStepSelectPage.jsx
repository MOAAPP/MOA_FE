import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import BottomNavBar from "../../components/layout/BottomNavBar";
import "./StudyStepSelectPage.css";

const LockIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 29" fill="none">
		<path d="M20.3077 10.875H19.3846V7.4163C19.3846 3.25752 16.3195 0 11.9658 0C7.59462 0 4.61538 3.32684 4.61538 7.4163V10.875H3.69231C1.656 10.875 0 12.5008 0 14.5V25.375C0 27.3742 1.656 29 3.69231 29H20.3077C22.344 29 24 27.3742 24 25.375V14.5C24 12.5008 22.344 10.875 20.3077 10.875ZM6.46154 7.4163C6.46154 4.32689 8.61231 1.8125 11.9658 1.8125C15.2848 1.8125 17.5385 4.27388 17.5385 7.4163V10.875H6.46154V7.4163ZM22.1539 25.375C22.1539 26.3741 21.3254 27.1875 20.3077 27.1875H3.69234C2.67464 27.1875 1.84618 26.3741 1.84618 25.375V14.5C1.84618 13.5009 2.67464 12.6875 3.69234 12.6875H20.3077C21.3254 12.6875 22.1539 13.5009 22.1539 14.5V25.375ZM12 16.3125C10.9805 16.3125 10.1539 17.124 10.1539 18.125C10.1539 18.7943 10.5277 19.372 11.077 19.686V22.6562C11.077 23.1565 11.4905 23.5625 12 23.5625C12.5096 23.5625 12.9231 23.1565 12.9231 22.6562V19.686C13.4723 19.372 13.8462 18.7938 13.8462 18.125C13.8462 17.124 13.0196 16.3125 12 16.3125Z" fill="#9FA3AC"/>
	</svg>
);

const SINGLE_VOWELS = ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ", "ㅣ", "ㅐ", "ㅔ"];
const DOUBLE_VOWELS = ["ㅑ", "ㅕ", "ㅛ", "ㅠ", "ㅒ", "ㅖ", "ㅢ"];

const vowelVideoMap = {
	"ㅏ": "ah_front",
	"ㅓ": "uh_front",
	"ㅗ": "oh_front",
	"ㅜ": "woo_front",
	"ㅡ": "eu_front",
	"ㅣ": "i_front",
	"ㅐ": "ah_front",
	"ㅔ": "ah_front",
	"ㅑ": "ah_front",
	"ㅕ": "uh_front",
	"ㅛ": "oh_front",
	"ㅠ": "woo_front",
	"ㅒ": "ah_front",
	"ㅖ": "ah_front",
	"ㅢ": "eu_front",
};

function StudyStepSelectPage() {
	const navigate = useNavigate();
	const { category } = useParams();
	const [selectedStep, setSelectedStep] = useState(null);
	const [page, setPage] = useState(1);
	const [vowelTab, setVowelTab] = useState("single");
	const [selectedVowel, setSelectedVowel] = useState(null);

	// 페이지 1: 단계 선택
	if (page === 1) return (
		<div className="study-container">
			{/* 헤더 */}
			<header className="step-header">
				<button className="back-btn" onClick={() => navigate(-1)}>← 학습하기</button>
				<h2 className="step-title">학습 단계 선택</h2>
				<p className="step-desc">현재 학습할 단계를 선택해 주세요</p>
			</header>

			{/* 단계 카드 목록 */}
			<main className="step-list">
				<div
					className={`step-card active ${selectedStep === 'vowel' ? 'selected' : ''}`}
					onClick={() => setSelectedStep('vowel')}
				>
					<div className="card-info">
						<h4>모음</h4>
						<p>발음의 기초를 다지는 단계예요</p>
					</div>
					<span className="status-badge">진행중</span>
				</div>

				<div className="step-card locked">
					<div className="card-info">
						<h4>음절</h4>
						<p>모음 훈련을 완료하면 열려요</p>
					</div>
					<span className="status-lock"><LockIcon /></span>
				</div>

				<div className="step-card locked">
					<div className="card-info">
						<h4>단어</h4>
						<p>음절 훈련을 완료하면 열려요</p>
					</div>
					<span className="status-lock"><LockIcon /></span>
				</div>

				<div className="step-card locked">
					<div className="card-info">
						<h4>문장</h4>
						<p>단어 훈련을 완료하면 열려요</p>
					</div>
					<span className="status-lock"><LockIcon /></span>
				</div>
			</main>

			{/* 하단 버튼 */}
			<div className="footer-btns">
				<button className="btn-prev" onClick={() => navigate(-1)}>이전</button>
				<button
					className="btn-next"
					disabled={!selectedStep}
					onClick={() => setPage(2)}
				>
					다음
				</button>
			</div>

			<BottomNavBar activeNav="study" />
		</div>
	);

	// 페이지 2: 모음 선택
	if (page === 2) return (
		<div className="study-container">
			{/* 헤더 */}
			<header className="step-header">
				<button className="back-btn" onClick={() => setPage(1)}>← 학습 단계 선택</button>
				<h2 className="step-title">목표 모음 선택</h2>
				<p className="step-desc">집중 연습할 모음을 골라주세요.</p>
			</header>

			{/* 단/이중모음 탭 */}
			<div className="vowel-tab-bar">
				<button
					className={`vowel-tab ${vowelTab === 'single' ? 'active' : ''}`}
					onClick={() => setVowelTab('single')}
				>단모음</button>
				<button
					className={`vowel-tab ${vowelTab === 'double' ? 'active' : ''}`}
					onClick={() => setVowelTab('double')}
				>이중모음</button>
			</div>

			{/* 모음 그리드 카드 */}
			<div className="vowel-card">
				<h3 className="vowel-card-title">
					{vowelTab === 'single' ? '단모음' : '이중모음'} 목록
				</h3>
				<p className="vowel-card-desc">연습하고 싶은 모음을 선택해 주세요.</p>
				<div className="vowel-grid">
					{(vowelTab === 'single' ? SINGLE_VOWELS : DOUBLE_VOWELS).map((v) => (
						<button
							key={v}
							className={`vowel-btn ${selectedVowel === v ? 'active' : ''}`}
							onClick={() => setSelectedVowel(v)}
						>
							{selectedVowel === v && (
								<span className="vowel-check">
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10" fill="none">
										<path fillRule="evenodd" clipRule="evenodd" d="M11.734 0.169378C11.8879 0.295303 11.9855 0.477215 12.0054 0.675105C12.0252 0.872996 11.9656 1.07066 11.8397 1.22463L5.08972 9.47463C5.02337 9.55573 4.94077 9.62202 4.84723 9.66925C4.7537 9.71647 4.6513 9.74356 4.54665 9.74879C4.442 9.75402 4.33742 9.73727 4.23964 9.6996C4.14187 9.66194 4.05307 9.60421 3.97897 9.53013L0.228966 5.78013C0.157334 5.71094 0.100197 5.62818 0.0608901 5.53668C0.0215834 5.44518 0.00089368 5.34676 2.83178e-05 5.24718C-0.000837044 5.14759 0.0181391 5.04884 0.0558497 4.95666C0.0935604 4.86449 0.14925 4.78075 0.21967 4.71033C0.290089 4.63991 0.373828 4.58422 0.466001 4.54651C0.558173 4.5088 0.656933 4.48982 0.756517 4.49069C0.856102 4.49156 0.954516 4.51225 1.04602 4.55155C1.13752 4.59086 1.22028 4.648 1.28947 4.71963L4.45372 7.88388L10.6787 0.275128C10.8046 0.12119 10.9866 0.0235715 11.1844 0.00374022C11.3823 -0.016091 11.58 0.0434892 11.734 0.169378Z" fill="#F7F9FF"/>
									</svg>
								</span>
							)}
							{v}
						</button>
					))}
				</div>
			</div>

			{/* 모음 설명 박스 */}
			<div className="vowel-info-box">
				<p className="vowel-info-title">
					{vowelTab === 'single' ? '단모음이란?' : '이중모음이란?'}
				</p>
				<ul className="vowel-info-list">
					{vowelTab === 'single' ? (
						<>
							<li>발음하는 동안 입술 모양이나 혀의 위치가 바뀌지 않는 모음이에요.</li>
							<li>핵심: 발음하는 동안 입술과 혀가 움직이지 않아야 해요.</li>
							<li>팁: 3D 가이드의 턱 벌림 정도를 확인하며 고정해 보세요.</li>
						</>
					) : (
						<>
							<li>발음하는 동안 입술 모양이나 혀의 위치가 바뀌는 모음이에요.</li>
							<li>핵심: 시작 모양에서 끝 모양으로 자연스럽게 이어져야 해요.</li>
							<li>팁: 3D 가이드로 입술 변화를 확인하며 연습해 보세요.</li>
						</>
					)}
				</ul>
			</div>

			{/* 하단 버튼 */}
			<div className="footer-btns">
				<button className="btn-prev" onClick={() => setPage(1)}>이전</button>
				<button
					className="btn-next"
					disabled={!selectedVowel}
					onClick={() => setPage(3)}
				>
					다음
				</button>
			</div>

			<BottomNavBar activeNav="study" />
		</div>
	);

	// 페이지 3: 학습 시작 안내
	return (
		<div className="study-container">
			{/* 헤더 */}
			<header className="step-header">
				<button className="back-btn" onClick={() => setPage(2)}>← 목표 모음 선택</button>
			</header>

			{/* 선택된 모음 카드 */}
			<div className="selected-vowel-card">
				{selectedVowel}
			</div>

			{/* 입모양 영상 */}
			<div className="video-wrapper">
				<video
					className="vowel-video"
					src={`/src/assets/videos/${vowelVideoMap[selectedVowel] || 'ah_front'}.mp4`}
					autoPlay
					loop
					muted
					playsInline
				/>
			</div>

			{/* 가이드 박스 */}
			<div className="guide-box">
				<p className="guide-title">입모양 가이드</p>
				<ul className="guide-list">
					<li>입을 자연스럽게 아래로 크게 벌려주세요</li>
					<li>혀는 아랫니 뒤쪽에 평평하게 놓아요</li>
					<li>공기를 목 안에서 앞으로 밀어내듯 내보내세요</li>
				</ul>
			</div>

			<div className="guide-box">
				<p className="guide-title">학습 진행 방식</p>
				<ul className="guide-list">
					<li>입모양을 따라 발음해 보세요</li>
					<li>실시간 피드백을 확인하며 입모양을 연습해요</li>
					<li>입모양이 익숙해지면 2단계에서 음성을 연습해요</li>
				</ul>
			</div>

			{/* 하단 버튼 */}
			<div className="footer-btns">
				<button className="btn-prev" onClick={() => setPage(2)}>이전</button>
				<button
					className="btn-next"
					onClick={() => navigate(`/study/vowel/${selectedVowel}`)}
				>
					시작하기
				</button>
			</div>

			<BottomNavBar activeNav="study" />
		</div>
	);
}

export default StudyStepSelectPage;
