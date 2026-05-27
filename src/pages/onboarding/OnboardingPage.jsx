import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileScreen from "../../components/layout/MobileScreen";
import AppButton from "../../components/common/AppButton";
import OnboardingIndicator from "../../components/onboarding/OnboardingIndicator";
import { onboardingVisual1, onboardingVisual2, onboardingVisual3 } from "../../assets/images/onboarding";
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
    desc: "입 모양과 혀의 움직임을 보며\n발음이 만들어지는 과정을 배워요.",
  },
  {
    visual: onboardingVisual2,
    alt: "발음 교정 분석 이미지",
    titleParts: [
      { text: "왜 어려웠는지,", highlight: false },
    ],
    titleSecond: "어떻게 고치면 되는지 알려줘요",
    titleSecondHighlight: true,
    desc: "어려운 부분을 분석하고\n다시 따라할 수 있게 도와줘요.",
  },
  {
    visual: onboardingVisual3,
    alt: "보호자·교사와 함께하는 학습 이미지",
    titleParts: [
      { text: "집과 학교에서도", highlight: false },
    ],
    titleSecond: "함께 이어가요",
    titleSecondHighlight: true,
    desc: "보호자와 교사가 함께 보며\n필요한 연습을 이어갈 수 있어요.",
  },
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slide = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;

  function handleNext() {
    if (isLast) {
      navigate("/login");
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  return (
    <MobileScreen className="onboarding-page">
      <section className="onboarding-content">
        <div className="onboarding-text">
          <h1>
            <span>
              {slide.titleParts.map((part, i) => (
                <span key={i} className={part.highlight ? "onboarding-highlight" : ""}>
                  {part.text}
                </span>
              ))}
            </span>
            <br />
            <span className={slide.titleSecondHighlight ? "onboarding-highlight" : ""}>
              {slide.titleSecond}
            </span>
          </h1>
          <p>{slide.desc}</p>
        </div>

        <div className="onboarding-visual-wrap">
          <img
            key={currentIndex}
            src={slide.visual}
            alt={slide.alt}
            className="onboarding-visual"
          />
        </div>

        <OnboardingIndicator currentIndex={currentIndex} total={SLIDES.length} />
      </section>

      <div className="onboarding-bottom">
        <AppButton onClick={handleNext}>시작하기</AppButton>
      </div>
    </MobileScreen>
  );
}

export default OnboardingPage;
