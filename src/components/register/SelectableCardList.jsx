import radioChecked from "../../assets/images/register/radio-checked.svg";
import radioUnchecked from "../../assets/images/register/radio-unchecked.svg";
import "./SelectableCardList.css";

function SelectableCardList({ options, value, onChange }) {
  return (
    <div className="selectable-card-list">
      {options.map((option) => {
        const selected = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            className={`selectable-card${
              selected ? " selectable-card--selected" : ""
            }`}
            onClick={() => onChange(option.id)}
            aria-pressed={selected}
          >
            <div className="selectable-card-text">
              <span className="selectable-card-label">
                {option.label}
              </span>

              {option.desc && (
                <span className="selectable-card-desc">
                  {option.desc}
                </span>
              )}
            </div>

            <img
              src={selected ? radioChecked : radioUnchecked}
              alt=""
              aria-hidden="true"
              className="selectable-card-radio-image"
              draggable="false"
            />
          </button>
        );
      })}
    </div>
  );
}

export default SelectableCardList;