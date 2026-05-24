import MobileScreen from "../../components/layout/MobileScreen";
import SplashBackground from "./SplashBackground";
import SplashLogo from "./SplashLogo";
import SplashBrandText from "./SplashBrandText";
import "./SplashPage.css";

function SplashPage() {
  return (
    <MobileScreen className="splash-page">
      <SplashBackground />

      <SplashLogo />
      <SplashBrandText />

      <div className="splash-title">
        <p>듣지 않아도,</p>
        <p>발음을 배울 수 있어요</p>
      </div>
    </MobileScreen>
  );
}

export default SplashPage;