import "./BottomNavigation.css";

function BottomNavigation({
  onPrev,
  onNext,
  prevLabel = "이전",
  nextLabel = "다음",
  nextDisabled = false,
}) {
  return (
    <div className="register-bottom-navigation">
      {onPrev ? (
        <button
          type="button"
          className="register-bottom-navigation-btn register-bottom-navigation-prev"
          onClick={onPrev}
        >
          {prevLabel}
        </button>
      ) : (
        <div className="register-bottom-navigation-empty" />
      )}

      <button
        type="button"
        className="register-bottom-navigation-btn register-bottom-navigation-next"
        onClick={onNext}
        disabled={nextDisabled}
      >
        {nextLabel}
      </button>
    </div>
  );
}

export default BottomNavigation;