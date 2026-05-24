import { moaLogo } from "../../assets/images/splash";

function SplashLogo() {
  return (
    <h1 className="splash-logo" aria-label="MOA">
      <img src={moaLogo} alt="MOA 로고" className="splash-logo-image" />
    </h1>
  );
}

export default SplashLogo;