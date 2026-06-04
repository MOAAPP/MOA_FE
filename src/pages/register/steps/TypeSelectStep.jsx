import RegisterStepHeader from "../../../components/register/RegisterStepHeader";
import SelectableCardList from "../../../components/register/SelectableCardList";
import "./TypeSelectStep.css";

const TYPES = [
  {
    id: "learner",
    label: "학습자",
    desc: "발음을 직접 연습하고\nAI 피드백을 받고 싶어요",
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
    <div className="type-select-step">
      <RegisterStepHeader
        title="나에게 맞는 유형을 선택해주세요"
        subtitle="선택한 유형에 따라 기능이 달라져요"
      />

      <SelectableCardList
        options={TYPES}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default TypeSelectStep;