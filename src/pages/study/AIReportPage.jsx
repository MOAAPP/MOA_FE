import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import BottomNavBar from "../../components/layout/BottomNavBar";
import "./AIReportPage.css";

const API_BASE = "http://localhost:8000";

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M6.66699 7.5H5.83366C5.39163 7.5 4.96771 7.67559 4.65515 7.98816C4.34259 8.30072 4.16699 8.72464 4.16699 9.16667V15.8333C4.16699 16.2754 4.34259 16.6993 4.65515 17.0118C4.96771 17.3244 5.39163 17.5 5.83366 17.5H14.167C14.609 17.5 15.0329 17.3244 15.3455 17.0118C15.6581 16.6993 15.8337 16.2754 15.8337 15.8333V9.16667C15.8337 8.72464 15.6581 8.30072 15.3455 7.98816C15.0329 7.67559 14.609 7.5 14.167 7.5H13.3337M10.0003 11.6667V2.5M12.5003 5L10.0003 2.5L7.50033 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#5681FF"/>
    <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const STAGES = [
  { label: "입모양 데이터 분석 중",  sections: ["result"] },
  { label: "음성 패턴 분석 중",       sections: ["section0"] },
  { label: "발음 오류 분류 중",       sections: ["section1"] },
  { label: "AI 리포트 생성 중",       sections: ["section2", "footer"] },
];

const SECTION_KEYS = ["result", "section0", "section1", "section2", "footer"];

const splitToItems = (text = "") => {
  if (!text) return [];
  const sentences = text
    .split(/(?<=[.!?요])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  return sentences.length >= 2 ? sentences : [text];
};

function AIReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedData = location.state || null;

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [stageIdx, setStageIdx] = useState(0);
  const [doneStages, setDoneStages] = useState(new Set());
  const [visibleSections, setVisibleSections] = useState(new Set());

  const timerRef = useRef(null);

  useEffect(() => {
    fetchReport();
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!reportData) return;

    const runStage = (idx) => {
      if (idx >= STAGES.length) return;
      setStageIdx(idx);

      timerRef.current = setTimeout(() => {
        setDoneStages(prev => new Set([...prev, idx]));

        const keys = STAGES[idx].sections;
        keys.forEach((key, ki) => {
          setTimeout(() => {
            setVisibleSections(prev => new Set([...prev, key]));
          }, ki * 230);
        });

        const delay = keys.length * 230 + 500;
        timerRef.current = setTimeout(() => {
          if (idx + 1 >= STAGES.length) {
            setStageIdx(STAGES.length);
          } else {
            runStage(idx + 1);
          }
        }, delay);
      }, 1000);
    };

    timerRef.current = setTimeout(() => runStage(0), 300);
  }, [reportData]);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const lipReport = passedData?.lip_report ?? JSON.parse(localStorage.getItem("lip_report") || "null");
      const speechReport = passedData?.speech_report ?? JSON.parse(localStorage.getItem("speech_report") || "null");
      const targetWord = passedData?.target_word ?? localStorage.getItem("target_word") ?? "ㅏ";
      const totalAttempts = passedData?.total_attempts ?? parseInt(localStorage.getItem("total_attempts") || "1");

      const res = await fetch(`${API_BASE}/api/feedback/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_word: targetWord,
          total_attempts: totalAttempts,
          lip_report: lipReport,
          speech_report: speechReport,
        }),
      });

      if (!res.ok) throw new Error("리포트 생성 실패");
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      setReportData(getDummyReport());
    } finally {
      setIsLoading(false);
    }
  };

// mvp 기준 모음 형식으로
  const getDummyReport = () => ({
  target_word: "ㅏ",
  analysis_summary: {
    speech_summary: {
      recent_feedbacks: [
        "목표 모음에 가까워지는 흐름이 보여요.",
        "소리를 낼 때 목소리 흐름도 함께 확인했어요.",
      ],
    },
  },
  report: {
    subtitle: "최근 연습에서 목표 모음에 가까워졌어요",
    result_cards: [
      { label: "가장 먼저 고칠 소리", value: "목표 모음" },
      { label: "가장 잘한 부분", value: "입모양 유지" },
      { label: "오류 원인", value: "소리 흐름" },
      { label: "다음 추천", value: "짧게 반복" },
    ],
    sections: [
      {
        title: "한눈에 보는 결과",
        content:
          "최근 연습에서는 목표 모음에 가까워지는 흐름이 보여요. 소리를 낼 때 입모양과 목소리 흐름을 함께 확인했어요.",
      },
      {
        title: "왜 이런 결과가 나왔나요?",
        content:
          "목표 모음이 인식된 정도와 목소리 안정성을 함께 반영했어요. 소리가 길게 이어지거나 흔들리면 결과가 조금 달라질 수 있어요.",
      },
      {
        title: "지금 무엇을 하면 좋을까요?",
        content:
          "입모양을 먼저 맞춘 뒤, 목표 소리를 한 번만 짧고 또렷하게 내보세요.",
      },
    ],
  },
});

  const isVisible = (key) => visibleSections.has(key);
  const allDone = doneStages.size >= STAGES.length && !isLoading && reportData !== null;

  const report = reportData?.report;

  const recentFeedbacks = (() => {
    const fromApi = reportData?.analysis_summary?.speech_summary?.recent_feedbacks ?? [];
    if (fromApi.length > 0) return fromApi;
    return splitToItems(report?.sections?.[0]?.content ?? "");
  })();

  const section0Content = report?.sections?.[0]?.content ?? "";
  const checkItems = recentFeedbacks.slice(0, 2);

  const currentLabel = isLoading
    ? "결과 화면을 준비하고 있어요"
    : allDone
    ? "분석이 완료됐어요!"
    : STAGES[Math.min(stageIdx, STAGES.length - 1)]?.label + " 중이에요";

  const subLabel = isLoading
    ? "발음 결과 분석 중"
    : allDone
    ? "분석 완료"
    : STAGES[Math.min(stageIdx, STAGES.length - 1)]?.label;

  const progressPct = isLoading
    ? 10
    : allDone
    ? 100
    : Math.round(((stageIdx + (doneStages.has(stageIdx) ? 1 : 0.4)) / STAGES.length) * 100);

  return (
    <div className="ar-container">
      {/* 헤더 */}
      <header className="ar-header">
        <span className="ar-header-title">발음 결과</span>
        <button className="ar-share-btn" aria-label="공유"><ShareIcon /></button>
      </header>

      {/* 상단 고정 상태 바 */}
      <div className={`ar-status-bar ${allDone ? "ar-status-done" : ""}`}>
        <div className="ar-status-inner">
          <div className="ar-spinner-wrap">
            {allDone
              ? <div className="ar-status-check">✓</div>
              : <div className="ar-spinner" />
            }
          </div>
          <div className="ar-status-right">
            <span className="ar-status-sub">
              {subLabel}
              {!allDone && <span className="ar-status-dots"> ···</span>}
            </span>
            <span className={`ar-status-msg ${allDone ? "ar-status-complete" : ""}`}>
              {currentLabel}
            </span>
            <div className="ar-progress-wrap">
              <div className="ar-progress-bar" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 스크롤 콘텐츠 */}
      <div className="ar-scroll">

        {/* 로딩 스켈레톤 */}
        {isLoading && (
          <div className="ar-skeleton-wrap">
            <div className="ar-skeleton ar-sk-wide" />
            <div className="ar-sk-grid">
              <div className="ar-skeleton ar-sk-card" />
              <div className="ar-skeleton ar-sk-card" />
              <div className="ar-skeleton ar-sk-card" />
              <div className="ar-skeleton ar-sk-card" />
            </div>
            <div className="ar-skeleton ar-sk-block" />
            <div className="ar-skeleton ar-sk-short" />
          </div>
        )}

        {/* RESULT 카드 */}
        {report && (
          <div className={`ar-result-section ar-pop ${isVisible("result") ? "ar-pop-in" : ""}`}>
            <p className="ar-result-label">RESULT</p>
            <p className="ar-result-subtitle">
              최근 연습 결과를 바탕으로 정리했어요
            </p>

            <div className="ar-cards-grid">
              <div className="ar-card">
                <p className="ar-card-label">가장 먼저 확인할 부분</p>
                <p className="ar-card-value">목표 모음</p>
              </div>

              <div className="ar-card">
                <p className="ar-card-label">가장 잘한 부분</p>
                <p className="ar-card-value">입모양 유지</p>
              </div>

              <div className="ar-card">
                <p className="ar-card-label">함께 볼 부분</p>
                <p className="ar-card-value">소리 흐름</p>
              </div>

              <div className="ar-card">
                <p className="ar-card-label">다음 추천</p>
                <p className="ar-card-value">짧게 반복</p>
              </div>
            </div>
          </div>
        )}

        {/* 섹션 0, 1, 2 — 하나의 파란 박스로 통합 */}
        {report?.sections?.[0] && (
          <div className={`ar-section ar-section-blue ar-pop ${isVisible("section0") ? "ar-pop-in" : ""}`}>

            {/* 한눈에 보는 결과 */}
            <div className="ar-check-list-div">
              <p className="ar-section-title">{report.sections[0].title}</p>

              <div className="ar-summary-box">
                <p className="ar-section-content">
                  {section0Content}
                </p>
              </div>

              <div className="ar-check-list">
                {checkItems.map((fb, fi) => (
                  <div key={fi} className="ar-check-item">
                    <CheckIcon />
                    <p className="ar-check-text">{fb}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 왜 이런 결과 */}
            {report.sections[1] && (
              <div className={`ar-inner-section ar-pop ${isVisible("section1") ? "ar-pop-in" : ""}`}>
                <p className="ar-section-title">{report.sections[1].title}</p>
                <p className="ar-section-content">{report.sections[1].content}</p>
              </div>
            )}

            {/* 지금 무엇을 */}
            {report.sections[2] && (
              <div className={`ar-inner-section ar-pop ${isVisible("section2") ? "ar-pop-in" : ""}`}>
                <p className="ar-section-title">{report.sections[2].title}</p>
                <p className="ar-section-content">{report.sections[2].content}</p>
              </div>
            )}

          </div>
        )}

        {/* 버튼 */}
        {report && (
          <div className={`ar-footer ar-pop ${isVisible("footer") ? "ar-pop-in" : ""}`}>
            <button className="ar-btn-retry" onClick={() => navigate(-1)}>
              부족한 발음 연습하기
            </button>
            <button className="ar-btn-home" onClick={() => navigate("/")}>
              홈으로 가기
            </button>
          </div>
        )}

      </div>

      <BottomNavBar activeNav="study" />
    </div>
  );
}

export default AIReportPage;
