import { useNavigate } from "react-router-dom"; 

// 네 폴더에 있는 통째로 된 가로 일자 이미지 4개 import
import barHomeActive from "../../assets/images/nav/nav-home.svg";    
import barStudyActive from "../../assets/images/nav/nav-study.svg";     
import barRecordActive from "../../assets/images/nav/nav-record.svg";   
import barMypageActive from "../../assets/images/nav/nav-mypage.svg";   

import "./BottomNavBar.css";

// 투명하게 4등분 클릭 영역을 만들기 위한 버튼 데이터
const NAV_BUTTONS = [
  { id: "home", label: "홈", path: "/home" },
  { id: "study", label: "학습", path: "/" },
  { id: "record", label: "기록", path: "/record" },
  { id: "mypage", label: "마이페이지", path: "/mypage" },
];

function BottomNavBar({ activeNav }) {
  const navigate = useNavigate(); 

  // 부모(StudyStartPage)가 넘겨준 activeNav 값에 따라 통짜 이미지 한 장 선택
  const getNavbarImage = () => {
    switch (activeNav) {
      case "home": return barHomeActive;
      case "study": return barStudyActive;
      case "record": return barRecordActive;
      case "mypage": return barMypageActive;
      default: return barStudyActive; // 기본적으론 학습 페이지니까 학습 배경
    }
  };

  return (
    <nav className="bottom-nav-bar">
      {/* 1. 뒷배경에 불이 켜진 통째로 된 가로 바 이미지 한 장을 턱 깔아줌 */}
      <img src={getNavbarImage()} alt="하단 네비게이션 바" className="nav-background-img" />

      {/* 2. 그 위에 투명한 버튼 4개를 올려서 클릭 영역만 만들어줌 */}
      <div className="nav-click-overlay">
        {NAV_BUTTONS.map((btn) => (
          <button
            key={btn.id}
            className="nav-click-btn"
            title={btn.label}
            onClick={() => navigate(btn.path)} // 투명 버튼 누르면 해당 페이지로 이동!
          />
        ))}
      </div>
    </nav>
  );
}

export default BottomNavBar;