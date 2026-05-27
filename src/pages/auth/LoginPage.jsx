import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MobileScreen from "../../components/layout/MobileScreen";
import AppInput from "../../components/common/AppInput";
import AppButton from "../../components/common/AppButton";
import { login } from "../../api/auth";
import { moaLogo, puzzleBottomLeft, puzzleBottomRight } from "../../assets/images/splash";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLogin, setKeepLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!userId.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력해 주세요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login({ userId, password });
      navigate("/home");
    } catch (err) {
      setError(err.message ?? "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
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

      <div className="login-fields">
        <AppInput
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="아이디"
        />
        <AppInput
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          rightAction={
            <button
              type="button"
              className="login-eye-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? (
                <EyeOnIcon />
              ) : (
                <EyeOffIcon />
              )}
            </button>
          }
          error={error}
        />
      </div>

      <label className="login-keep">
        <input
          type="checkbox"
          checked={keepLogin}
          onChange={(e) => setKeepLogin(e.target.checked)}
          className="login-keep-checkbox"
        />
        <span className="login-keep-label">로그인 상태 유지</span>
      </label>

      <div className="login-bg-puzzles" aria-hidden="true">
        <img src={puzzleBottomLeft} alt="" className="login-puzzle login-puzzle-left" />
        <img src={puzzleBottomRight} alt="" className="login-puzzle login-puzzle-right" />
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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function EyeOnIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default LoginPage;
