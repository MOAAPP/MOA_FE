import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SplashPage from "../pages/splash/SplashPage";
import OnboardingPage from "../pages/onboarding/OnboardingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/register/RegisterPage";
import RegisterCompletePage from "../pages/register/RegisterCompletePage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/complete" element={<RegisterCompletePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
