import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MobileScreen from "../../components/layout/MobileScreen";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import { moaLogo } from "../../assets/images/splash";
import checkboxChecked from "../../assets/images/login/checkbox-checked.svg";
import loginBgPuzzle from "../../assets/images/login/login-bg-puzzle.svg";
import "./LoginPage.css";

const TEST_ACCOUNT = {
  userId: "MOA",
  password: "MOAMOAMOA!",
};

function LoginPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLogin, setKeepLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleUserIdChange(event) {
    setUserId(event.target.value);

    if (error) {
      setError("");
    }
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);

    if (error) {
      setError("");
    }
  }

  function handleLogin() {
    if (!userId.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);

    const isValidAccount =
      userId === TEST_ACCOUNT.userId &&
      password === TEST_ACCOUNT.password;

    if (isValidAccount) {
      if (keepLogin) {
        localStorage.setItem("moaKeepLogin", "true");
        localStorage.setItem("moaUserId", userId);
      } else {
        localStorage.removeItem("moaKeepLogin");
        localStorage.removeItem("moaUserId");
      }

      navigate("/study");
      return;
    }

    setError("아이디 또는 비밀번호가 일치하지 않습니다.");
    setLoading(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleLogin();
    }
  }

  return (
    <MobileScreen className="login-page">
      <div className="login-header">
        <div className="login-header-text">
          <p className="login-greeting">다시 만나서 반가워요</p>

          <h1 className="login-title">
            MOA에 로그인하고
            <br />
            학습을 이어가세요
          </h1>
        </div>

        <img src={moaLogo} alt="MOA 로고" className="login-logo" />
      </div>

      <div className="login-fields" onKeyDown={handleKeyDown}>
        <AppInput
          id="userId"
          value={userId}
          onChange={handleUserIdChange}
          placeholder="아이디"
        />

        <AppInput
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          placeholder="비밀번호"
          rightAction={
            <button
              type="button"
              className="login-eye-btn"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? <EyeOnIcon /> : <EyeOffIcon />}
            </button>
          }
          error={error}
        />
      </div>

      <label className="login-keep">
        <input
          type="checkbox"
          checked={keepLogin}
          onChange={(event) => setKeepLogin(event.target.checked)}
          className="login-keep-checkbox"
        />

        <span className="login-checkbox-icon" aria-hidden="true">
          {keepLogin ? (
            <img
              src={checkboxChecked}
              alt=""
              className="login-checkbox-checked-image"
            />
          ) : (
            <span className="login-checkbox-unchecked" />
          )}
        </span>

        <span className="login-keep-label">로그인 상태 유지</span>
      </label>

      <div className="login-bg-puzzles" aria-hidden="true">
        <img
          src={loginBgPuzzle}
          alt=""
          className="login-bg-puzzle-image"
        />
      </div>

      <div className="login-bottom">
        <AppButton onClick={handleLogin} disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </AppButton>

        <p className="login-signup-link">
          계정이 없으신가요?{" "}
          <Link to="/register" className="login-signup-anchor">
            회원가입하기
          </Link>
        </p>
      </div>
    </MobileScreen>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function EyeOnIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default LoginPage;