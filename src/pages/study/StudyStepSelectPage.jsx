import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileScreen from "../../components/layout/MobileScreen";
import backIcon from "../../assets/images/study/icon-back.svg";
import "./StudyStepSelectPage.css";

const SINGLE_VOWELS = ["ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ", "ㅣ", "ㅐ", "ㅔ"];
const DOUBLE_VOWELS = ["ㅑ", "ㅕ", "ㅛ", "ㅠ", "ㅒ", "ㅖ", "ㅢ"];

const VOWEL_VIDEO_MAP = {
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

  const [currentView, setCurrentView] = useState("selectVowel");
  const [vowelTab, setVowelTab] = useState("single");
  const [selectedVowel, setSelectedVowel] = useState(null);

  const currentVowels =
    vowelTab === "single" ? SINGLE_VOWELS : DOUBLE_VOWELS;

  function handleTabChange(tab) {
    setVowelTab(tab);
    setSelectedVowel(null);
  }

  function handleGoToGuide() {
    if (!selectedVowel) return;
    setCurrentView("guide");
  }

  function handleStartStudy() {
    if (!selectedVowel) return;
    navigate(`/study/vowel/${selectedVowel}`);
  }

  // 목표 모음 선택 화면
  if (currentView === "selectVowel") {
    return (
      <MobileScreen className="study-select-page">
        <div className="study-select-scroll">
          <header className="study-select-header">
            <BackButton
              label="학습하기"
              onClick={() => navigate(-1)}
            />

            <h1 className="study-select-title">목표 모음 선택</h1>
            <p className="study-select-description">
              집중 연습할 모음을 골라주세요.
            </p>
          </header>

          <div className="study-select-tab-bar">
            <button
              type="button"
              className={`study-select-tab${
                vowelTab === "single" ? " active" : ""
              }`}
              onClick={() => handleTabChange("single")}
            >
              단모음
            </button>

            <button
              type="button"
              className={`study-select-tab${
                vowelTab === "double" ? " active" : ""
              }`}
              onClick={() => handleTabChange("double")}
            >
              이중모음
            </button>
          </div>

          <section className="study-select-vowel-card">
            <h2 className="study-select-vowel-card-title">
              {vowelTab === "single" ? "단모음" : "이중모음"} 목록
            </h2>

            <p className="study-select-vowel-card-description">
              연습하고 싶은 모음을 선택해 주세요.
            </p>

            <div className="study-select-vowel-grid">
              {currentVowels.map((vowel) => {
                const isSelected = selectedVowel === vowel;

                return (
                  <button
                    key={vowel}
                    type="button"
                    className={`study-select-vowel-button${
                      isSelected ? " active" : ""
                    }`}
                    onClick={() => setSelectedVowel(vowel)}
                    aria-pressed={isSelected}
                  >
                    {isSelected && (
                      <span
                        className="study-select-vowel-check"
                        aria-hidden="true"
                      >
                        <CheckIcon />
                      </span>
                    )}

                    {vowel}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="study-select-info-box">
            <h2 className="study-select-info-title">
              {vowelTab === "single" ? "단모음이란?" : "이중모음이란?"}
            </h2>

            <ul className="study-select-info-list">
              {vowelTab === "single" ? (
                <>
                  <li>
                    발음하는 동안 입술 모양이나 혀의 위치가 바뀌지 않는
                    모음이에요.
                  </li>
                  <li>
                    핵심: 발음하는 동안 입술과 혀가 움직이지 않아야 해요.
                  </li>
                  <li>
                    팁: 3D 가이드의 턱 벌림 정도를 확인하며 고정해 보세요.
                  </li>
                </>
              ) : (
                <>
                  <li>
                    발음하는 동안 입술 모양이나 혀의 위치가 바뀌는
                    모음이에요.
                  </li>
                  <li>
                    핵심: 시작 모양에서 끝 모양으로 자연스럽게 이어져야 해요.
                  </li>
                  <li>
                    팁: 3D 가이드로 입술 변화를 확인하며 연습해 보세요.
                  </li>
                </>
              )}
            </ul>
          </section>
        </div>

        <div className="study-select-footer">
          <button
            type="button"
            className="study-select-footer-button study-select-footer-prev"
            onClick={() => navigate(-1)}
          >
            이전
          </button>

          <button
            type="button"
            className="study-select-footer-button study-select-footer-next"
            disabled={!selectedVowel}
            onClick={handleGoToGuide}
          >
            다음
          </button>
        </div>
      </MobileScreen>
    );
  }

  // 학습 시작 안내 화면
  return (
    <MobileScreen className="study-select-page">
      {/* 뒤로가기 영역은 고정 */}
      <header className="study-select-fixed-header">
        <BackButton
          label="목표 모음 선택"
          onClick={() => setCurrentView("selectVowel")}
        />
      </header>

      {/* 뒤로가기 영역 아래 콘텐츠만 스크롤 */}
      <div className="study-select-guide-scroll">
        <div className="study-select-selected-vowel">
          {selectedVowel}
        </div>

        <div className="study-select-video-wrapper">
          <video
            className="study-select-video"
            src={`/src/assets/videos/${
              VOWEL_VIDEO_MAP[selectedVowel] || "ah_front"
            }.mp4`}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        <section className="study-select-guide-box">
          <h2 className="study-select-guide-title">입모양 가이드</h2>

          <ul className="study-select-guide-list">
            <li>입을 자연스럽게 아래로 크게 벌려주세요</li>
            <li>혀는 아랫니 뒤쪽에 평평하게 놓아요</li>
            <li>공기를 목 안에서 앞으로 밀어내듯 내보내세요</li>
          </ul>
        </section>

        <section className="study-select-guide-box">
          <h2 className="study-select-guide-title">학습 진행 방식</h2>

          <ul className="study-select-guide-list">
            <li>입모양을 따라 발음해 보세요</li>
            <li>실시간 피드백을 확인하며 입모양을 연습해요</li>
            <li>입모양이 익숙해지면 2단계에서 음성을 연습해요</li>
          </ul>
        </section>
      </div>

      <div className="study-select-footer">
        <button
          type="button"
          className="study-select-footer-button study-select-footer-prev"
          onClick={() => setCurrentView("selectVowel")}
        >
          이전
        </button>

        <button
          type="button"
          className="study-select-footer-button study-select-footer-next"
          onClick={handleStartStudy}
        >
          시작하기
        </button>
      </div>
    </MobileScreen>
  );
}

function BackButton({ label, onClick }) {
  return (
    <button
      type="button"
      className="study-select-back-button"
      onClick={onClick}
      aria-label={`${label} 화면으로 돌아가기`}
    >
      <img
        src={backIcon}
        alt=""
        className="study-select-back-icon"
        draggable="false"
      />

      <span className="study-select-back-label">
        {label}
      </span>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.734 0.169378C11.8879 0.295303 11.9855 0.477215 12.0054 0.675105C12.0252 0.872996 11.9656 1.07066 11.8397 1.22463L5.08972 9.47463C5.02337 9.55573 4.94077 9.62202 4.84723 9.66925C4.7537 9.71647 4.6513 9.74356 4.54665 9.74879C4.442 9.75402 4.33742 9.73727 4.23964 9.6996C4.14187 9.66194 4.05307 9.60421 3.97897 9.53013L0.228966 5.78013C0.157334 5.71094 0.100197 5.62818 0.0608901 5.53668C0.0215834 5.44518 0.00089368 5.34676 2.83178e-05 5.24718C-0.000837044 5.14759 0.0181391 5.04884 0.0558497 4.95666C0.0935604 4.86449 0.14925 4.78075 0.21967 4.71033C0.290089 4.63991 0.373828 4.58422 0.466001 4.54651C0.558173 4.5088 0.656933 4.48982 0.756517 4.49069C0.856102 4.49156 0.954516 4.51225 1.04602 4.55155C1.13752 4.59086 1.22028 4.648 1.28947 4.71963L4.45372 7.88388L10.6787 0.275128C10.8046 0.12119 10.9866 0.0235715 11.1844 0.00374022C11.3823 -0.016091 11.58 0.0434892 11.734 0.169378Z"
        fill="#F7F9FF"
      />
    </svg>
  );
}

export default StudyStepSelectPage;