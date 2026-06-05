import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileScreen from "../../components/layout/MobileScreen";
import AppButton from "../../components/common/AppButton";
import OnboardingIndicator from "../../components/onboarding/OnboardingIndicator";
import OnboardingText from "../../components/onboarding/OnboardingText";
import OnboardingVisual from "../../components/onboarding/OnboardingVisual";
import {
  onboardingVisual1,
  onboardingVisual2,
  onboardingVisual3,
} from "../../assets/images/onboarding";
import "./OnboardingPage.css";

const SLIDES = [
  {
    visual: onboardingVisual1,
    alt: "발음을 시각적으로 학습하는 이미지",
    titleParts: [
      { text: "발음을 ", highlight: false },
      { text: "눈으로 보고,", highlight: true },
    ],
    titleSecond: "쉽게 따라해요",
    titleSecondHighlight: false,
    desc: "입 모양과 혀의 움직임을 보며\n발음이 만들어지는 과정을 배워요.",
  },
  {
    visual: onboardingVisual2,
    alt: "발음 교정 분석 이미지",
    titleParts: [{ text: "왜 어려웠는지,", highlight: false }],
    titleSecond: "어떻게 고치면 되는지 알려줘요",
    titleSecondHighlight: true,
    desc: "어려운 부분을 분석하고\n다시 따라할 수 있게 도와줘요.",
  },
  {
    visual: onboardingVisual3,
    alt: "보호자와 교사가 함께하는 학습 이미지",
    titleParts: [{ text: "집과 학교에서도", highlight: false }],
    titleSecond: "함께 이어가요",
    titleSecondHighlight: true,
    desc: "보호자와 교사가 함께 보며\n필요한 연습을 이어갈 수 있어요.",
  },
];

const AUTO_SLIDE_DELAY = 20000;
const SWIPE_DISTANCE = 60;

function OnboardingPage() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);

  const isLast = currentIndex === SLIDES.length - 1;

  // MARK: - 자동 슬라이드 이동
  useEffect(() => {
    // 사용자가 직접 넘기고 있는 동안에는 자동 이동 잠시 멈춤
    if (isDragging) return undefined;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_SLIDE_DELAY);

    return () => clearTimeout(timer);
  }, [currentIndex, isDragging]);

  // MARK: - 드래그 시작
  function handlePointerDown(event) {
    startXRef.current = event.clientX;
    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  // MARK: - 드래그 중 이동
  function handlePointerMove(event) {
    if (!isDragging) return;

    const movedDistance = event.clientX - startXRef.current;

    // 첫 번째 화면에서 오른쪽으로 당길 때는 살짝만 움직임
    if (currentIndex === 0 && movedDistance > 0) {
      setDragOffset(movedDistance * 0.25);
      return;
    }

    // 세 번째 화면에서 왼쪽으로 당길 때도 살짝만 움직임
    // 자동 전환은 2초 후 첫 화면으로 돌아감
    if (isLast && movedDistance < 0) {
      setDragOffset(movedDistance * 0.25);
      return;
    }

    setDragOffset(movedDistance);
  }

  // MARK: - 드래그 종료
  function handlePointerUp(event) {
    if (!isDragging) return;

    const movedDistance = event.clientX - startXRef.current;

    // 왼쪽으로 밀면 다음 화면
    if (movedDistance <= -SWIPE_DISTANCE && !isLast) {
      setCurrentIndex((prev) => prev + 1);
    }

    // 오른쪽으로 밀면 이전 화면
    if (movedDistance >= SWIPE_DISTANCE && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }

    setDragOffset(0);
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  // MARK: - 드래그 취소
  function handlePointerCancel() {
    setDragOffset(0);
    setIsDragging(false);
  }

  // MARK: - 시작하기 버튼
  function handleStart() {
    navigate("/login");
  }

  return (
    <MobileScreen className="onboarding-page">
      <div
        className={`onboarding-slider ${isDragging ? "dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className={`onboarding-track ${isDragging ? "dragging" : ""}`}
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {SLIDES.map((slide, index) => (
            <section className="onboarding-slide" key={index}>
              <OnboardingText
                titleParts={slide.titleParts}
                titleSecond={slide.titleSecond}
                titleSecondHighlight={slide.titleSecondHighlight}
                desc={slide.desc}
              />

              <OnboardingVisual
                visual={slide.visual}
                alt={slide.alt}
              />
            </section>
          ))}
        </div>
      </div>

      <div className="onboarding-indicator-wrap">
        <OnboardingIndicator
          currentIndex={currentIndex}
          total={SLIDES.length}
        />
      </div>

      <div className="onboarding-bottom">
        <AppButton onClick={handleStart}>시작하기</AppButton>
      </div>
    </MobileScreen>
  );
}

export default OnboardingPage;