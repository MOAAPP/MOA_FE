import { useNavigate } from "react-router-dom";
import RegisterStepHeader from "../../../components/register/RegisterStepHeader";
import SelectableCardList from "../../../components/register/SelectableCardList";
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
  const navigate = useNavigate();

  return (
    <div className="membership-type-step">
      <RegisterStepHeader
        title="어떻게 시작할까요?"
        subtitle="연령에 맞는 가입 방식을 선택해주세요"
      />

      <SelectableCardList
        options={MEMBERSHIP_TYPES}
        value={value}
        onChange={onChange}
      />

      {value === "guardian" && (
        <div className="guardian-info-card">
          <p className="guardian-info-title">
            보호자와 함께 시작해볼까요?
          </p>

          <p className="guardian-info-desc">
            만 14세 미만 학습자는 보호자와 함께 가입해요
          </p>

          <div className="guardian-info-buttons">
            <button
              type="button"
              className="guardian-btn"
              onClick={() => navigate("/login")}
            >
              보호자 로그인하기
            </button>

            <button
              type="button"
              className="guardian-btn"
              onClick={() => navigate("/register")}
            >
              보호자 회원가입하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MembershipTypeStep;