import "./PuzzleSummaryCard.css";

function PuzzleSummaryCard({ label, value }) {
  return (
    <div className="puzzle-summary-card">
      <span className="puzzle-summary-label">{label}</span>
      <strong className="puzzle-summary-value">{value}</strong>
    </div>
  );
}

export default PuzzleSummaryCard;