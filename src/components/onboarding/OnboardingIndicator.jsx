import "./OnboardingIndicator.css";

function OnboardingIndicator({ currentIndex = 0, total = 3 }) {
  return (
    <div className="onboarding-indicator" aria-label={`온보딩 ${currentIndex + 1}번째 화면`}>
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={
            index === currentIndex
              ? "onboarding-indicator-dot active"
              : "onboarding-indicator-dot"
          }
        />
      ))}
    </div>
  );
}

export default OnboardingIndicator;