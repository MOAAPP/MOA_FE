import "./OnboardingText.css";

function OnboardingText({
  titleParts,
  titleSecond,
  titleSecondHighlight,
  desc,
}) {
  return (
    <div className="onboarding-text">
      <h1 className="onboarding-text-title">
        <span>
          {titleParts.map((part, index) => (
            <span
              key={index}
              className={part.highlight ? "onboarding-highlight" : ""}
            >
              {part.text}
            </span>
          ))}
        </span>

        <br />

        <span
          className={titleSecondHighlight ? "onboarding-highlight" : ""}
        >
          {titleSecond}
        </span>
      </h1>

      <p className="onboarding-text-description">
        {desc.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            {index !== desc.split("\n").length - 1 && <br />}
          </span>
        ))}
      </p>
    </div>
  );
}

export default OnboardingText;