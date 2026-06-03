import "./LearningPreferenceStep.css";

const SECTIONS = [
  {
    id: "ageGroup",
    title: "학습 대상 연령",
    mode: "single",
    columns: 3,
    options: ["유아·초등", "중·고등", "성인"],
  },
  {
    id: "hearingType",
    title: "청각 특성 선택",
    mode: "single",
    columns: 2,
    options: ["선천성 청각장애", "후천성 청각장애", "난청", "기타"],
  },
  {
    id: "learningGoal",
    title: "학습 목적",
    mode: "multi",
    columns: 2,
    options: ["발음 교정", "의사소통", "일상 대화", "학교 생활", "기타"],
  },
  {
    id: "pronunciationLevel",
    title: "현재 발음 수준",
    mode: "single",
    columns: 3,
    options: ["초급", "중급", "고급"],
  },
];

function LearningPreferenceStep({ value, onChange }) {
  function handleToggle(sectionId, option, mode) {
    const current = value[sectionId];
    if (mode === "single") {
      onChange({ ...value, [sectionId]: option });
    } else {
      const arr = Array.isArray(current) ? current : [];
      const next = arr.includes(option)
        ? arr.filter((o) => o !== option)
        : [...arr, option];
      onChange({ ...value, [sectionId]: next });
    }
  }

  return (
    <div className="step-content learning-pref">
      <div className="step-header">
        <h1 className="step-title">맞춤 학습을 설정해요</h1>
        <p className="step-subtitle">맞춤 학습을 위해 필요한 정보를 선택해주세요</p>
      </div>

      <div className="learning-sections">
        {SECTIONS.map((section) => {
          const current = value[section.id];
          return (
            <div key={section.id} className="learning-section">
              <div className="learning-section-header">
                <span className="learning-section-title">{section.title}</span>
                <span className="learning-section-mode">
                  {section.mode === "single" ? "단일 선택" : "복수 선택"}
                </span>
              </div>
              <div
                className="learning-options"
                style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}
              >
                {section.options.map((option) => {
                  const selected =
                    section.mode === "single"
                      ? current === option
                      : Array.isArray(current) && current.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`learning-option-btn${selected ? " learning-option-btn--selected" : ""}`}
                      onClick={() => handleToggle(section.id, option, section.mode)}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LearningPreferenceStep;
