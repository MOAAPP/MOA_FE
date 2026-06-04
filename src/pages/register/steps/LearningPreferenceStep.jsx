import RegisterStepHeader from "../../../components/register/RegisterStepHeader";
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
    const currentValue = value[sectionId];

    if (mode === "single") {
      onChange({
        ...value,
        [sectionId]: option,
      });
      return;
    }

    const selectedOptions = Array.isArray(currentValue)
      ? currentValue
      : [];

    const nextOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((selectedOption) => selectedOption !== option)
      : [...selectedOptions, option];

    onChange({
      ...value,
      [sectionId]: nextOptions,
    });
  }

  return (
    <div className="learning-preference-step">
      <RegisterStepHeader
        title="맞춤 학습을 설정해요"
        subtitle="맞춤 학습을 위해 필요한 정보를 선택해주세요"
      />

      <div className="learning-preference-sections">
        {SECTIONS.map((section) => (
          <LearningPreferenceSection
            key={section.id}
            section={section}
            value={value[section.id]}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}

function LearningPreferenceSection({ section, value, onToggle }) {
  return (
    <section
      className="learning-preference-section"
      aria-labelledby={`${section.id}-title`}
    >
      <div className="learning-preference-section-header">
        <h2
          id={`${section.id}-title`}
          className="learning-preference-section-title"
        >
          {section.title}
        </h2>

        <span className="learning-preference-section-mode">
          {section.mode === "single" ? "단일 선택" : "복수 선택"}
        </span>
      </div>

      <div
        className="learning-preference-options"
        style={{
          gridTemplateColumns: `repeat(${section.columns}, minmax(0, 1fr))`,
        }}
      >
        {section.options.map((option) => {
          const selected =
            section.mode === "single"
              ? value === option
              : Array.isArray(value) && value.includes(option);

          return (
            <button
              key={option}
              type="button"
              className={`learning-preference-option${
                selected ? " learning-preference-option--selected" : ""
              }`}
              onClick={() => onToggle(section.id, option, section.mode)}
              aria-pressed={selected}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default LearningPreferenceStep;