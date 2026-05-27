import "./MembershipTypeStep.css";

const MEMBERSHIP_TYPES = [
  {
    id: "self",
    label: "내 계정으로 시작하기",
    desc: "만 14세 이상부터 직접 가입할 수 있어요",
  },
  {
    id: "guardian",
    label: "보호자와 함께 시작하기",
    desc: "만 14세 미만은\n보호자와 함께 가입해요",
  },
];

function MembershipTypeStep({ value, onChange }) {
  return (
    <div className="step-content membership-type">
      <div className="step-header">
        <h1 className="step-title">어떻게 시작할까요?</h1>
        <p className="step-subtitle">연령에 맞는 가입 방식을 선택해주세요</p>
      </div>

      <div className="type-card-list">
        {MEMBERSHIP_TYPES.map((type) => {
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

export default MembershipTypeStep;
