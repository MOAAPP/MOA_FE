import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toBlob } from "html-to-image";
import MobileScreen from "../../components/layout/MobileScreen";
import "./AIReportPage.css";

const API_BASE = "http://localhost:8001";

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M6.66699 7.5H5.83366C5.39163 7.5 4.96771 7.67559 4.65515 7.98816C4.34259 8.30072 4.16699 8.72464 4.16699 9.16667V15.8333C4.16699 16.2754 4.34259 16.6993 4.65515 17.0118C4.96771 17.3244 5.39163 17.5 5.83366 17.5H14.167C14.609 17.5 15.0329 17.3244 15.3455 17.0118C15.6581 16.6993 15.8337 16.2754 15.8337 15.8333V9.16667C15.8337 8.72464 15.6581 8.30072 15.3455 7.98816C15.0329 7.67559 14.609 7.5 14.167 7.5H13.3337M10.0003 11.6667V2.5M12.5003 5L10.0003 2.5L7.50033 5"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="12" fill="#5681FF" />
    <path
      d="M7 12.5l3.5 3.5 6.5-7"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const STAGES = [
  {
    label: "입모양 데이터 분석 중",
    sections: ["result"],
  },
  {
    label: "음성 패턴 분석 중",
    sections: ["section0"],
  },
  {
    label: "발음 오류 분류 중",
    sections: ["section1"],
  },
  {
    label: "AI 리포트 생성 중",
    sections: ["section2", "footer"],
  },
];

function splitToItems(text = "") {
  if (!text) return [];

  const sentences = text
    .split(/(?<=[.!?요])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  return sentences.length >= 2 ? sentences : [text];
}

function getDummyReport() {
  return {
    target_word: "ㅏ",
    analysis_summary: {
      speech_summary: {
        recent_feedbacks: [],
      },
    },
    report: {
      subtitle: "지난 연습보다 자음 정확도가 향상되었어요",
      result_cards: [
        {
          label: "가장 먼저 고칠 소리",
          value: "ㅅ · ㅈ",
        },
        {
          label: "가장 잘한 부분",
          value: "모음 · 리듬",
        },
        {
          label: "오류 원인",
          value: "혀 위치 · 공기 흐름",
        },
        {
          label: "다음 추천",
          value: "취약 자음 연습",
        },
      ],
      sections: [
        {
          title: "한눈에 보는 결과",
          content:
            "이번 결과는 모음과 리듬은 좋고, 자음 선명도는 더 올릴 수 있는 상태예요. 특히 ㅅ 발음에서 혀 위치와 공기 흐름을 조금만 조정하면 전체 발음이 더 또렷해질 수 있어요.",
        },
        {
          title: "왜 이런 결과가 나왔나요?",
          content:
            "혀끝 위치가 윗니 뒤쪽보다 조금 아래에 머물고, 공기 흐름이 좁게 모이지 않아 자음 선명도가 떨어졌어요.",
        },
        {
          title: "지금 무엇을 하면 좋을까요?",
          content:
            "전체를 다시 하기보다 ㅅ, ㅈ처럼 취약한 자음부터 짧게 반복 연습하면 더 빠르게 좋아질 수 있어요.",
        },
      ],
    },
  };
}

function AIReportPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const passedData = location.state || null;

  const timerRef = useRef(null);
  const sectionTimersRef = useRef([]);
  const reportCaptureRef = useRef(null);

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  const [stageIndex, setStageIndex] = useState(0);
  const [doneStages, setDoneStages] = useState(new Set());
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    async function fetchReport() {
      setIsLoading(true);

      try {
        const lipReport =
          passedData?.lip_report ??
          JSON.parse(localStorage.getItem("lip_report") || "null");

        const speechReport =
          passedData?.speech_report ??
          JSON.parse(localStorage.getItem("speech_report") || "null");

        const targetWord =
          passedData?.target_word ??
          localStorage.getItem("target_word") ??
          "ㅏ";

        const totalAttempts =
          passedData?.total_attempts ??
          parseInt(localStorage.getItem("total_attempts") || "1", 10);

        const response = await fetch(`${API_BASE}/api/feedback/report`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target_word: targetWord,
            total_attempts: totalAttempts,
            lip_report: lipReport,
            speech_report: speechReport,
          }),
        });

        if (!response.ok) {
          throw new Error("리포트 생성 실패");
        }

        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error("리포트 생성 실패:", error);
        setReportData(getDummyReport());
      } finally {
        setIsLoading(false);
      }
    }

    fetchReport();
  }, [passedData]);

  useEffect(() => {
    if (!reportData) return undefined;

    function runStage(index) {
      if (index >= STAGES.length) return;

      setStageIndex(index);

      timerRef.current = setTimeout(() => {
        setDoneStages((previous) => new Set([...previous, index]));

        const sectionKeys = STAGES[index].sections;

        sectionKeys.forEach((sectionKey, sectionIndex) => {
          const sectionTimer = setTimeout(() => {
            setVisibleSections(
              (previous) => new Set([...previous, sectionKey])
            );
          }, sectionIndex * 230);

          sectionTimersRef.current.push(sectionTimer);
        });

        const nextStageDelay = sectionKeys.length * 230 + 500;

        timerRef.current = setTimeout(() => {
          if (index + 1 >= STAGES.length) {
            setStageIndex(STAGES.length);
          } else {
            runStage(index + 1);
          }
        }, nextStageDelay);
      }, 1000);
    }

    timerRef.current = setTimeout(() => runStage(0), 300);

    return () => {
      clearTimeout(timerRef.current);

      sectionTimersRef.current.forEach((timer) => {
        clearTimeout(timer);
      });

      sectionTimersRef.current = [];
    };
  }, [reportData]);

  const report = reportData?.report;

  const allDone =
    doneStages.size >= STAGES.length &&
    !isLoading &&
    reportData !== null;

  const recentFeedbacks = (() => {
    const feedbacksFromApi =
      reportData?.analysis_summary?.speech_summary?.recent_feedbacks ?? [];

    if (feedbacksFromApi.length > 0) {
      return feedbacksFromApi;
    }

    return splitToItems(report?.sections?.[0]?.content ?? "");
  })();

  const currentLabel = isLoading
    ? "결과 화면을 준비하고 있어요"
    : allDone
      ? "분석이 완료됐어요!"
      : `${STAGES[Math.min(stageIndex, STAGES.length - 1)]?.label} 중이에요`;

  const subLabel = isLoading
    ? "발음 결과 분석 중"
    : allDone
      ? "분석 완료"
      : STAGES[Math.min(stageIndex, STAGES.length - 1)]?.label;

  const progressPercent = isLoading
    ? 10
    : allDone
      ? 100
      : Math.round(
          ((stageIndex + (doneStages.has(stageIndex) ? 1 : 0.4)) /
            STAGES.length) *
            100
        );

  function isVisible(sectionKey) {
    return visibleSections.has(sectionKey);
  }

  function downloadReportImage(imageBlob, fileName) {
    const imageUrl = URL.createObjectURL(imageBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = imageUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(imageUrl);
  }

  async function handleShareReport() {
    if (!reportCaptureRef.current || !allDone || isSharing) return;

    setIsSharing(true);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const imageBlob = await toBlob(reportCaptureRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#F7F9FF",
      });

      if (!imageBlob) {
        throw new Error("PNG 이미지 생성 실패");
      }

      const safeTargetWord = String(reportData?.target_word ?? "학습").replace(
        /[^\w가-힣ㄱ-ㅎㅏ-ㅣ-]/g,
        ""
      );

      const fileName = `MOA_발음결과_${safeTargetWord || "학습"}.png`;

      const imageFile = new File([imageBlob], fileName, {
        type: "image/png",
      });

      const canSharePngFile =
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({
          files: [imageFile],
        });

      if (canSharePngFile) {
        await navigator.share({
          title: "MOA 발음 결과",
          text: "오늘의 발음 학습 결과를 공유해요.",
          files: [imageFile],
        });

        return;
      }

      downloadReportImage(imageBlob, fileName);

      window.alert(
        "현재 브라우저에서는 파일 공유창을 지원하지 않아 PNG 이미지로 저장했어요."
      );
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }

      console.error("리포트 이미지 공유 실패:", error);
      window.alert("리포트 이미지 공유에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <MobileScreen className="ar-page">
      {/* 상단 헤더 */}
      <header className="ar-header">
        <span className="ar-header-title">발음 결과</span>

        <button
          type="button"
          className="ar-share-btn"
          aria-label={
            isSharing ? "공유 이미지 생성 중" : "발음 결과 이미지 공유"
          }
          onClick={handleShareReport}
          disabled={!allDone || isSharing}
        >
          <ShareIcon />
        </button>
      </header>

      {/* 분석 진행 상태 바 */}
      <div className={`ar-status-bar ${allDone ? "ar-status-done" : ""}`}>
        <div className="ar-status-inner">
          <div className="ar-spinner-wrap">
            {allDone ? (
              <div className="ar-status-check">✓</div>
            ) : (
              <div className="ar-spinner" />
            )}
          </div>

          <div className="ar-status-right">
            <span className="ar-status-sub">
              {subLabel}

              {!allDone && (
                <span className="ar-status-dots">···</span>
              )}
            </span>

            <span
              className={`ar-status-msg${
                allDone ? " ar-status-complete" : ""
              }`}
            >
              {currentLabel}
            </span>

            <div className="ar-progress-wrap">
              <div
                className="ar-progress-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 결과 내용 스크롤 영역 */}
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

        {/* PNG 공유 이미지에 포함되는 리포트 영역 */}
        {report && (
          <div
            ref={reportCaptureRef}
            className="ar-report-capture"
          >
            {/* RESULT 카드 */}
            <section
              className={`ar-result-section ar-pop${
                isVisible("result") ? " ar-pop-in" : ""
              }`}
            >
              <p className="ar-result-label">RESULT</p>
              <p className="ar-result-subtitle">{report.subtitle}</p>

              <div className="ar-cards-grid">
                {report.result_cards?.map((card, index) => (
                  <div key={`${card.label}-${index}`} className="ar-card">
                    <p className="ar-card-label">{card.label}</p>
                    <p className="ar-card-value">{card.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 분석 내용 섹션 */}
            {report.sections?.[0] && (
              <section
                className={`ar-section ar-section-blue ar-pop${
                  isVisible("section0") ? " ar-pop-in" : ""
                }`}
              >
                <div className="ar-check-list-div">
                  <p className="ar-section-title">
                    {report.sections[0].title}
                  </p>

                  <div className="ar-check-list">
                    {recentFeedbacks.map((feedbackText, index) => (
                      <div
                        key={`${feedbackText}-${index}`}
                        className="ar-check-item"
                      >
                        <CheckIcon />

                        <p className="ar-check-text">
                          {feedbackText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {report.sections[1] && (
                  <div
                    className={`ar-inner-section ar-pop${
                      isVisible("section1") ? " ar-pop-in" : ""
                    }`}
                  >
                    <p className="ar-section-title">
                      {report.sections[1].title}
                    </p>

                    <p className="ar-section-content">
                      {report.sections[1].content}
                    </p>
                  </div>
                )}

                {report.sections[2] && (
                  <div
                    className={`ar-inner-section ar-pop${
                      isVisible("section2") ? " ar-pop-in" : ""
                    }`}
                  >
                    <p className="ar-section-title">
                      {report.sections[2].title}
                    </p>

                    <p className="ar-section-content">
                      {report.sections[2].content}
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* 하단 버튼: 공유 이미지에는 포함되지 않음 */}
        {report && (
          <div
            className={`ar-footer ar-pop${
              isVisible("footer") ? " ar-pop-in" : ""
            }`}
          >
            <button
              type="button"
              className="ar-btn-retry"
              onClick={() => navigate(-1)}
            >
              부족한 발음 연습하기
            </button>

            <button
              type="button"
              className="ar-btn-home"
              onClick={() => navigate("/study")}
            >
              홈으로 가기
            </button>
          </div>
        )}
      </div>
    </MobileScreen>
  );
}

export default AIReportPage;