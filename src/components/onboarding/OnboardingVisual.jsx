import "./OnboardingVisual.css";

function OnboardingVisual({ visual, alt }) {
  return (
    <div className="onboarding-visual-wrap">
      <img
        src={visual}
        alt={alt}
        className="onboarding-visual"
        draggable="false"
      />
    </div>
  );
}

export default OnboardingVisual;