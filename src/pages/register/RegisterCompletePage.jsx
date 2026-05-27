import { useNavigate } from "react-router-dom";
import MobileScreen from "../../components/layout/MobileScreen";
import AppButton from "../../components/common/AppButton";
import { moaLogo, puzzleTopRight, puzzleBottomLeft } from "../../assets/images/splash";
import "./RegisterCompletePage.css";

function RegisterCompletePage() {
  const navigate = useNavigate();

  return (
    <MobileScreen className="complete-page">
      <div className="complete-bg" aria-hidden="true">
        <img src={puzzleTopRight} alt="" className="complete-puzzle complete-puzzle-tr" />
        <img src={puzzleBottomLeft} alt="" className="complete-puzzle complete-puzzle-bl" />
      </div>

      <div className="complete-center">
        <img src={moaLogo} alt="MOA 로고" className="complete-logo" />
        <p className="complete-brand">MOA</p>
        <p className="complete-message">이제 MOA를 시작해볼까요?</p>
      </div>

      <div className="complete-bottom">
        <AppButton onClick={() => navigate("/login")}>로그인하러 가기</AppButton>
      </div>
    </MobileScreen>
  );
}

export default RegisterCompletePage;
