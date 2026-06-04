import { useNavigate } from "react-router-dom";
import MobileScreen from "../../components/layout/MobileScreen";
import AppButton from "../../components/common/AppButton";
import { moaLogo } from "../../assets/images/splash";
import completePuzzleRain from "../../assets/images/register/complete-puzzle-rain.svg";
import "./RegisterCompletePage.css";

function RegisterCompletePage() {
  const navigate = useNavigate();

  return (
    <MobileScreen className="complete-page">
      <div className="complete-rain" aria-hidden="true">
        <img
          src={completePuzzleRain}
          alt=""
          className="complete-rain-layer complete-rain-layer--first"
          draggable="false"
        />
        <img
          src={completePuzzleRain}
          alt=""
          className="complete-rain-layer complete-rain-layer--second"
          draggable="false"
        />
      </div>

      <div className="complete-overlay" aria-hidden="true" />

      <main className="complete-content">
        <div className="complete-center">
          <div className="complete-logo-wrap">
            <img src={moaLogo} alt="MOA 로고" className="complete-logo" />
          </div>

          <p className="complete-brand">MOA</p>

          <div className="complete-message-wrap">
            <h1 className="complete-title">가입이 완료되었어요!</h1>
            <p className="complete-message">
              이제 MOA에서 발음 연습을
              <br />
              시작해볼까요?
            </p>
          </div>
        </div>

        <div className="complete-bottom">
          <AppButton onClick={() => navigate("/login")}>
            로그인하러 가기
          </AppButton>
        </div>
      </main>
    </MobileScreen>
  );
}

export default RegisterCompletePage;