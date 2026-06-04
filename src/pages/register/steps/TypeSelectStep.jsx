import "./TypeSelectStep.css";

const TYPES = [
  {
    id: "learner",
    label: "학습자",
    desc: "발음을 연습하고\nAI 피드백으로 교정해보세요",
  },
  {
    id: "teacher",
    label: "교사",
    desc: "학습자의 연습 과정을 함께 보고\n필요한 연습을 도와줄 수 있어요",
  },
  {
    id: "guardian",
    label: "보호자",
    desc: "아이의 연습 과정을 함께 보고\n필요한 연습을 도와줄 수 있어요",
  },
];

function TypeSelectStep({ value, onChange }) {
  return (
    <div className="step-content type-select">
      <div className="step-header">
        <h1 className="step-title">어떤 방식으로 MOA를 시작할까요?</h1>
        <p className="step-subtitle">선택한 유형에 따라 기능이 달라져요</p>
      </div>

      <div className="type-card-list">
        {TYPES.map((type) => {
          const selected = value === type.id;
          return (
            <button
              key={type.id}
              type="button"
              className={`type-card${selected ? " type-card--selected" : ""}`}
              onClick={() => onChange(type.id)}
            >
              <div className="type-card-text">
                <span className="type-card-label">{type.label}</span>
                <span className="type-card-desc">{type.desc}</span>
              </div>
              <span className={`type-card-radio${selected ? " type-card-radio--checked" : ""}`}>
                {selected && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TypeSelectStep;
