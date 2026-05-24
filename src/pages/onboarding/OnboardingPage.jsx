import MobileScreen from "../../components/layout/MobileScreen";
import AppButton from "../../components/common/AppButton";
import OnboardingIndicator from "../../components/onboarding/OnboardingIndicator";
import { onboardingVisual1 } from "../../assets/images/onboarding";
import "./OnboardingPage.css";

function OnboardingPage() {
  return (
    <MobileScreen className="onboarding-page">
      <section className="onboarding-content">
        <div className="onboarding-text">
          <h1>
            발음을 눈으로 보고
            <br />
            쉽게 따라해요
          </h1>

          <p>
            입술, 혀, 공기 흐름을 시각적으로 보여줘서 발음이
            <br />
            어떻게 만들어지는지 눈으로 이해할 수 있어요
          </p>
        </div>

        <div className="onboarding-visual-wrap">
          <img
            src={onboardingVisual1}
            alt="발음 학습을 시각적으로 보여주는 이미지"
            className="onboarding-visual"
          />
        </div>

        <OnboardingIndicator currentIndex={0} total={3} />
      </section>

      <div className="onboarding-bottom">
        <AppButton>시작하기</AppButton>
      </div>
    </MobileScreen>
  );
}

export default OnboardingPage;