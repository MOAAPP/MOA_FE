import completeIcon from "../../assets/images/record/complete_puzzle.svg";
import saveIcon from "../../assets/images/record/save_icon.svg";
import "./MonthCompleteBanner.css";

function MonthCompleteBanner({ month }) {
  return (
    <section className="month-complete-banner">
      <div className="month-complete-left">
        <div className="month-complete-title-row">
          <img className="month-complete-icon" src={completeIcon} alt="" />
          <h3>{month}월 퍼즐 완성!</h3>
        </div>

        <p>멋져요! 이달의 퍼즐을 모두 채웠어요</p>
      </div>

      <button type="button" className="month-complete-button">
        <img src={saveIcon} alt="" />
        <span>완성 퍼즐 저장하기</span>
      </button>
    </section>
  );
}

export default MonthCompleteBanner;