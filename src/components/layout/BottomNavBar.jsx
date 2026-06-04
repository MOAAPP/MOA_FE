import { useNavigate } from "react-router-dom";

import studyDefaultIcon from "../../assets/images/nav/study-default.svg";
import studyActiveIcon from "../../assets/images/nav/study-active.svg";
import recordDefaultIcon from "../../assets/images/nav/record-default.svg";
import recordActiveIcon from "../../assets/images/nav/record-active.svg";

import "./BottomNavBar.css";

const NAV_ITEMS = [
  {
    id: "study",
    label: "학습",
    path: "/study",
    defaultIcon: studyDefaultIcon,
    activeIcon: studyActiveIcon,
  },
  {
    id: "record",
    label: "기록",
    path: "/record",
    defaultIcon: recordDefaultIcon,
    activeIcon: recordActiveIcon,
  },
];

function BottomNavBar({ activeNav = "study" }) {
  const navigate = useNavigate();

  return (
    <nav className="study-bottom-nav-bar" aria-label="하단 메뉴">
      {NAV_ITEMS.map((item) => {
        const isActive = activeNav === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className={`study-bottom-nav-item${
              isActive ? " study-bottom-nav-item--active" : ""
            }`}
            onClick={() => navigate(item.path)}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="study-bottom-nav-icon-wrap">
              <img
                src={isActive ? item.activeIcon : item.defaultIcon}
                alt=""
                aria-hidden="true"
                className="study-bottom-nav-icon"
                draggable="false"
              />
            </span>

            <span className="study-bottom-nav-label">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNavBar;