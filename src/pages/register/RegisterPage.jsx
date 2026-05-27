import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileScreen from "../../components/layout/MobileScreen";
import BottomNavigation from "../../components/common/BottomNavigation";
import TypeSelectStep from "./steps/TypeSelectStep";
import MembershipTypeStep from "./steps/MembershipTypeStep";
import BasicInfoStep from "./steps/BasicInfoStep";
import AccountInfoStep from "./steps/AccountInfoStep";
import LearningPreferenceStep from "./steps/LearningPreferenceStep";
import { register } from "../../api/auth";
import "./RegisterPage.css";

const INITIAL_FORM = {
  userType: "learner",
  membershipType: "self",
  name: "",
  birthDate: null,
  phone: "",
  email: "",
  userId: "",
  password: "",
  passwordConfirm: "",
  ageGroup: "",
  hearingType: "",
  learningGoal: [],
  pronunciationLevel: "",
};

function getSteps(userType) {
  const base = [
    "typeSelect",
    "membershipType",
    "basicInfo",
    "accountInfo",
  ];
  if (userType === "learner") return [...base, "learningPreference"];
  return base;
}

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const steps = getSteps(formData.userType);
  const currentStep = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  function handlePrev() {
    if (isFirst) {
      navigate("/login");
    } else {
      setStepIndex((i) => i - 1);
    }
  }

  async function handleNext() {
    if (isLast) {
      setLoading(true);
      try {
        await register(formData);
        navigate("/register/complete");
      } catch {
        navigate("/register/complete");
      } finally {
        setLoading(false);
      }
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function renderStep() {
    switch (currentStep) {
      case "typeSelect":
        return (
          <TypeSelectStep
            value={formData.userType}
            onChange={(v) => setFormData((d) => ({ ...d, userType: v }))}
          />
        );
      case "membershipType":
        return (
          <MembershipTypeStep
            value={formData.membershipType}
            onChange={(v) => setFormData((d) => ({ ...d, membershipType: v }))}
          />
        );
      case "basicInfo":
        return (
          <BasicInfoStep
            value={formData}
            onChange={(updated) => setFormData((d) => ({ ...d, ...updated }))}
          />
        );
      case "accountInfo":
        return (
          <AccountInfoStep
            value={formData}
            onChange={(updated) => setFormData((d) => ({ ...d, ...updated }))}
          />
        );
      case "learningPreference":
        return (
          <LearningPreferenceStep
            value={formData}
            onChange={(updated) => setFormData((d) => ({ ...d, ...updated }))}
          />
        );
      default:
        return null;
    }
  }

  return (
    <MobileScreen className="register-page">
      <div className="register-scroll">{renderStep()}</div>
      <BottomNavigation
        onPrev={handlePrev}
        onNext={handleNext}
        nextLabel={isLast ? (loading ? "처리 중..." : "완료") : "다음"}
        nextDisabled={loading || (currentStep === "typeSelect" && formData.userType !== "learner")}
      />
    </MobileScreen>
  );
}

export default RegisterPage;
