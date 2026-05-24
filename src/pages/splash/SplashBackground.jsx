import {
    puzzleTopLeft,
    puzzleTopRight,
    puzzleBottomLeft,
    puzzleBottomRight,
  } from "../../assets/images/splash";
  
  function SplashBackground() {
    return (
      <div className="splash-background" aria-hidden="true">
        <img
          src={puzzleTopLeft}
          alt=""
          className="splash-puzzle splash-puzzle-top-left"
        />
        <img
          src={puzzleTopRight}
          alt=""
          className="splash-puzzle splash-puzzle-top-right"
        />
        <img
          src={puzzleBottomLeft}
          alt=""
          className="splash-puzzle splash-puzzle-bottom-left"
        />
        <img
          src={puzzleBottomRight}
          alt=""
          className="splash-puzzle splash-puzzle-bottom-right"
        />
      </div>
    );
  }
  
  export default SplashBackground;