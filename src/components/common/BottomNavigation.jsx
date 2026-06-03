import "./BottomNavigation.css";

function BottomNavigation({
  onPrev,
  onNext,
  prevLabel = "이전",
  nextLabel = "다음",
  nextDisabled = false,
}) {
  return (
    <div className="bottom-nav">
      {onPrev ? (
        <button type="button" className="bottom-nav-btn bottom-nav-prev" onClick={onPrev}>
          {prevLabel}
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        className="bottom-nav-btn bottom-nav-next"
        onClick={onNext}
        disabled={nextDisabled}
      >
        {nextLabel}
      </button>
    </div>
  );
}

export default BottomNavigation;
