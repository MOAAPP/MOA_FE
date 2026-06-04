import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import MobileScreen from "../../components/layout/MobileScreen";
import backIcon from "../../assets/images/study/icon-back.svg";
import "./VowelStudyPage.css";

const API_BASE = "http://localhost:8001";

const MicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="33"
    height="44"
    viewBox="0 0 33 44"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M23.7332 8.23333C23.7332 4.23847 20.4947 1 16.4999 1C12.5051 1 9.2666 4.23847 9.2666 8.23333V21.6667C9.2666 25.6615 12.5051 28.9 16.4999 28.9C20.4947 28.9 23.7332 25.6615 23.7332 21.6667V8.23333Z"
      fill="#5681FF"
      stroke="#5681FF"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M1 20.6328C1 29.1929 7.93984 36.1328 16.4999 36.1328M16.4999 36.1328C25.06 36.1328 31.9999 29.1929 31.9999 20.6328M16.4999 36.1328V42.3328"
      stroke="#5681FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const vowelVideoMap = {
  "ㅏ": "ah_front",
  "ㅓ": "uh_front",
  "ㅗ": "oh_front",
  "ㅜ": "woo_front",
  "ㅡ": "eu_front",
  "ㅣ": "i_front",
  "ㅐ": "ah_front",
  "ㅔ": "ah_front",
  "ㅑ": "ah_front",
  "ㅕ": "uh_front",
  "ㅛ": "oh_front",
  "ㅠ": "woo_front",
  "ㅒ": "ah_front",
  "ㅖ": "ah_front",
  "ㅢ": "eu_front",
};

const VOWEL_GUIDES = {
  "ㅏ": "입은 세로로 크게 벌리고,\n혀는 편하게 둔 채 천천히 연습해보세요",
  "ㅓ": "입을 반쯤 벌리고,\n혀를 뒤로 살짝 당기며 발음해보세요",
  "ㅗ": "입술을 둥글게 모아 앞으로 내밀고,\n혀는 낮게 유지해보세요",
  "ㅜ": "입술을 작고 둥글게 모아,\n혀는 뒤로 당겨 발음해보세요",
  "ㅡ": "입을 가로로 살짝 벌리고,\n혀는 평평하게 유지해보세요",
  "ㅣ": "입을 양옆으로 당기고,\n혀를 앞쪽 윗니 뒤에 놓아보세요",
  "ㅐ": "입을 아래로 벌리고,\n혀를 중간 높이로 유지해보세요",
  "ㅔ": "입을 살짝 벌리고,\n혀를 앞쪽 중간 높이에 놓아보세요",
  "ㅑ": "ㅏ 모양에서 시작해\n빠르게 이어서 발음해보세요",
  "ㅕ": "ㅓ 모양에서 시작해\n자연스럽게 이어보세요",
  "ㅛ": "ㅗ 모양에서 시작해\n입술을 더 내밀며 이어보세요",
  "ㅠ": "ㅜ 모양에서 시작해\n빠르게 이어서 발음해보세요",
  "ㅒ": "ㅐ 모양에서 시작해\n자연스럽게 이어보세요",
  "ㅖ": "ㅔ 모양에서 시작해\n자연스럽게 이어보세요",
  "ㅢ": "ㅡ에서 ㅣ로 자연스럽게\n이어지도록 연습해보세요",
};

const VOWEL_SOUND_GUIDES = {
  "ㅏ": '입을 세로로 벌린 상태에서 숨을 내보내며 "아~~~" 소리를 이어가요.',
  "ㅓ": '입을 반쯤 벌린 상태에서 "어~~~" 소리를 이어가요.',
  "ㅗ": '입술을 둥글게 모은 상태에서 "오~~~" 소리를 이어가요.',
  "ㅜ": '입술을 작게 모은 상태에서 "우~~~" 소리를 이어가요.',
  "ㅡ": '입을 가로로 벌린 상태에서 "으~~~" 소리를 이어가요.',
  "ㅣ": '입을 양옆으로 당긴 상태에서 "이~~~" 소리를 이어가요.',
};

function getFeedbackFromAccuracy(accuracy) {
  if (accuracy === null) {
    return {
      text: "얼굴을 카메라에 맞춰주세요",
      sub: "입술이 잘 보이도록 가운데에 맞춰보세요",
    };
  }

  if (accuracy >= 80) {
    return {
      text: "입 모양이 정확해요! 🎉",
      sub: "이 상태를 유지하면서 연습해보세요",
    };
  }

  if (accuracy >= 60) {
    return {
      text: "거의 다 왔어요!",
      sub: "조금만 더 정확하게 맞춰보세요",
    };
  }

  if (accuracy >= 40) {
    return {
      text: "입을 조금 더 벌려보세요",
      sub: "혀는 편하게 두고 천천히 따라 해보세요",
    };
  }

  return {
    text: "입 모양을 다시 확인해보세요",
    sub: "가이드 영상을 참고하며 천천히 따라해보세요",
  };
}

const LM = {
  LEFT_EYE: 33,
  RIGHT_EYE: 263,
  NOSE_TIP: 4,
  CHIN: 152,
  LIP_LEFT: 61,
  LIP_RIGHT: 291,
  LIP_TOP: 13,
  LIP_BOTTOM: 14,
  LIP_TOP_INNER: 82,
  LIP_BOTTOM_INNER: 87,
};

function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function extractLipData(landmarks) {
  const lm = landmarks[0];

  const lip_width = dist(lm[LM.LIP_LEFT], lm[LM.LIP_RIGHT]);
  const lip_height = dist(lm[LM.LIP_TOP], lm[LM.LIP_BOTTOM]);
  const lip_open = dist(lm[LM.LIP_TOP_INNER], lm[LM.LIP_BOTTOM_INNER]);
  const face_scale = dist(lm[LM.NOSE_TIP], lm[LM.CHIN]);
  const eye_distance = dist(lm[LM.LEFT_EYE], lm[LM.RIGHT_EYE]);

  return {
    lip_width,
    lip_height,
    lip_open,
    face_scale,
    eye_distance,
  };
}

function extractFeedbackText(feedback) {
  if (!feedback) return "";
  if (typeof feedback === "string") return feedback;

  if (typeof feedback === "object") {
    return feedback.user_message ?? JSON.stringify(feedback);
  }

  return String(feedback);
}

function VowelStudyPage() {
  const navigate = useNavigate();
  const { vowel } = useParams();

  const selectedVowel = vowel || "ㅏ";
  const hint = VOWEL_GUIDES[selectedVowel] || VOWEL_GUIDES["ㅏ"];
  const soundGuide =
    VOWEL_SOUND_GUIDES[selectedVowel] || VOWEL_SOUND_GUIDES["ㅏ"];
  const videoSrc = vowelVideoMap[selectedVowel] || "ah_front";

  const [activeTab, setActiveTab] = useState(1);
  const [accuracy, setAccuracy] = useState(null);
  const [isGoalAchieved, setIsGoalAchieved] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sttResult, setSttResult] = useState(null);
  const [sttError, setSttError] = useState(null);

  const cameraVideoRef = useRef(null);
  const streamRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const intervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const waveAnimRef = useRef(null);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);

  const feedback = getFeedbackFromAccuracy(accuracy);

  const drawIdleWave = () => {
    cancelAnimationFrame(waveAnimRef.current);

    const canvases = [
      document.getElementById("waveCanvas_left"),
      document.getElementById("waveCanvas_right"),
    ];

    let phase = 0;

    const animate = () => {
      canvases.forEach((canvas) => {
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const W = canvas.width;
        const H = canvas.height;

        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(91, 120, 220, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();

        for (let x = 0; x <= W; x += 1) {
          const y =
            H / 2 + Math.sin((x / W) * Math.PI * 6 + phase) * 4;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
        ctx.setLineDash([]);
      });

      phase += 0.025;
      waveAnimRef.current = requestAnimationFrame(animate);
    };

    waveAnimRef.current = requestAnimationFrame(animate);
  };

  const drawLiveWave = () => {
    if (!analyserRef.current) return;

    const canvases = [
      document.getElementById("waveCanvas_left"),
      document.getElementById("waveCanvas_right"),
    ];

    const bufferLength = analyserRef.current.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    const draw = () => {
      analyserRef.current.getByteTimeDomainData(data);

      canvases.forEach((canvas) => {
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const W = canvas.width;
        const H = canvas.height;

        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(91, 120, 220, 0.85)";
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.beginPath();

        const sliceWidth = W / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i += 1) {
          const y = (data[i] / 128.0) * (H / 2);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(W, H / 2);
        ctx.stroke();
      });

      waveAnimRef.current = requestAnimationFrame(draw);
    };

    waveAnimRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    async function initMediaPipe() {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );
    }

    initMediaPipe();
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: 640,
          height: 480,
        },
        audio: false,
      });

      streamRef.current = stream;

      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("카메라 접근 실패:", error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const analyzeFrame = useCallback(async () => {
    if (!faceLandmarkerRef.current || !cameraVideoRef.current) return;

    const video = cameraVideoRef.current;

    if (video.readyState < 2) return;

    const results = faceLandmarkerRef.current.detectForVideo(
      video,
      performance.now()
    );

    if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
      return;
    }

    const {
      lip_width,
      lip_height,
      lip_open,
      face_scale,
      eye_distance,
    } = extractLipData(results.faceLandmarks);

    try {
      const response = await fetch(`${API_BASE}/lip/analyze-lip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vowel: selectedVowel,
          lip_width,
          lip_height,
          lip_open,
          face_scale,
          eye_distance,
        }),
      });

      if (!response.ok) return;

      const data = await response.json();

      if (data.accuracy !== undefined) {
        setAccuracy((previousAccuracy) => {
          const newAccuracy = data.accuracy;

          return newAccuracy > (previousAccuracy || 0)
            ? newAccuracy
            : previousAccuracy;
        });

        if (data.is_goal_achieved) {
          setIsGoalAchieved(true);
          clearInterval(intervalRef.current);
        }
      }
    } catch (error) {
      console.error("분석 요청 실패:", error);
    }
  }, [selectedVowel]);

  useEffect(() => {
    if (activeTab === 1) {
      startCamera();
      intervalRef.current = setInterval(analyzeFrame, 1500);
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [activeTab, analyzeFrame, startCamera, stopCamera]);

  useEffect(() => {
    if (activeTab === 2) {
      drawIdleWave();
    } else {
      cancelAnimationFrame(waveAnimRef.current);
    }

    return () => cancelAnimationFrame(waveAnimRef.current);
  }, [activeTab]);

  async function startRecording() {
    setSttResult(null);
    setSttError(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      cancelAnimationFrame(waveAnimRef.current);

      audioCtxRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();

      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;

      const source = audioCtxRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      drawLiveWave();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        stream.getTracks().forEach((track) => track.stop());
        cancelAnimationFrame(waveAnimRef.current);

        if (audioCtxRef.current) {
          audioCtxRef.current.close();
        }

        analyserRef.current = null;
        drawIdleWave();

        await sendAudioToServer(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setSttError("마이크 접근에 실패했어요. 권한을 확인해주세요.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  async function sendAudioToServer(audioBlob) {
    setIsAnalyzing(true);

    try {
      const formData = new FormData();

      formData.append("audio_file", audioBlob, "recording.webm");
      formData.append("target_word", selectedVowel);

      const response = await fetch(`${API_BASE}/api/stt/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 오류");
      }

      const data = await response.json();
      setSttResult(data);
    } catch {
      setSttError("음성 분석 중 오류가 발생했어요. 다시 시도해주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <MobileScreen className="vowel-study-page">
      <header className="vowel-study-fixed-header">
        <button
          type="button"
          className="vs-back-btn"
          onClick={() => navigate(-1)}
          aria-label="학습하기 화면으로 돌아가기"
        >
          <img
            src={backIcon}
            alt=""
            className="vs-back-icon"
            draggable="false"
          />
          <span className="vs-back-label">학습하기</span>
        </button>
      </header>

      <div className="vowel-study-scroll">
        <div className="vs-tab-bar">
          <div className={`vs-tab ${activeTab === 1 ? "active" : ""}`}>
            <span className="vs-tab-step">1단계</span>
            <span className="vs-tab-label">입모양 분석</span>
          </div>

          <div className={`vs-tab ${activeTab === 2 ? "active" : ""}`}>
            <span className="vs-tab-step">2단계</span>
            <span className="vs-tab-label">음성 분석</span>
          </div>
        </div>

        <div className="vs-hint-card">
          <div className="vs-vowel-preview">{selectedVowel}</div>

          <p className="vs-hint-text">
            {activeTab === 1
              ? hint
              : "입모양은 준비됐어요.\n이제 같은 입모양으로 소리를 내봐요"}
          </p>
        </div>

        {activeTab === 1 && (
          <>
            <div className="vs-section-card">
              <p className="vs-section-label">입모양 가이드</p>

              <div className="vs-guide-image-box">
                <video
                  className="vs-guide-video"
                  src={`/src/assets/videos/${videoSrc}.mp4`}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>

            <div className="vs-section-card">
              <p className="vs-section-label">내 입모양</p>

              <div className="vs-camera-box">
                <div className="vs-camera-corner tl" />
                <div className="vs-camera-corner tr" />
                <div className="vs-camera-corner bl" />
                <div className="vs-camera-corner br" />

                <video
                  ref={cameraVideoRef}
                  className="vs-camera-feed"
                  autoPlay
                  playsInline
                  muted
                />
              </div>
            </div>

            <div className="vs-feedback-box">
              <p className="vs-feedback-tag">AI 피드백</p>
              <p className="vs-feedback-main">{feedback.text}</p>
              <p className="vs-feedback-sub">{feedback.sub}</p>

              {accuracy !== null && (
                <div className="vs-accuracy-bar-wrap">
                  <div
                    className="vs-accuracy-bar"
                    style={{
                      width: isGoalAchieved ? "100%" : `${accuracy}%`,
                    }}
                  />

                  <span className="vs-accuracy-text">
                    {isGoalAchieved ? "100%" : `${accuracy.toFixed(1)}%`}
                  </span>
                </div>
              )}
            </div>

            <div className="vs-footer">
              <button
                type="button"
                className={`vs-next-btn ${!isGoalAchieved ? "disabled" : ""}`}
                onClick={() => isGoalAchieved && setActiveTab(2)}
              >
                {isGoalAchieved ? "2단계로 넘어가기 →" : "입모양 통과 전"}
              </button>

              <p className="vs-footer-sub">
                입모양이 목표에 가까워지면 다음 단계가 열려요
              </p>
            </div>
          </>
        )}

        {activeTab === 2 && (
          <>
            <div className="vs-section-card">
              <p className="vs-section-label">입모양 가이드</p>

              <div className="vs-guide-image-box">
                <video
                  className="vs-guide-video"
                  src={`/src/assets/videos/${videoSrc}.mp4`}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </div>

            <div className="vs-section-card">
              <p className="vs-section-label">입모양 그대로 소리 내기</p>

              <div className="vs-record-box">
                <p className="vs-record-desc">{soundGuide}</p>

                <div className="vs-record-wave-row">
                  <canvas
                    id="waveCanvas_left"
                    className="vs-wave-canvas"
                    width="150"
                    height="60"
                  />

                  <button
                    type="button"
                    className={`vs-mic-btn ${
                      isRecording ? "recording" : ""
                    }`}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isAnalyzing}
                    aria-label={isRecording ? "녹음 중지" : "녹음 시작"}
                  >
                    <svg
                      className="vs-mic-ring vs-mic-ring-outer"
                      xmlns="http://www.w3.org/2000/svg"
                      width="102"
                      height="102"
                      viewBox="0 0 102 102"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="51" cy="51" r="51" fill="#F7F9FF" />
                    </svg>

                    <svg
                      className="vs-mic-ring vs-mic-ring-inner"
                      xmlns="http://www.w3.org/2000/svg"
                      width="90"
                      height="90"
                      viewBox="0 0 101 101"
                      fill="none"
                      aria-hidden="true"
                    >
                      <g filter="url(#filter0_f)">
                        <circle
                          cx="50.2002"
                          cy="50.2002"
                          r="45"
                          fill="#B3C6FF"
                        />
                      </g>

                      <defs>
                        <filter
                          id="filter0_f"
                          x="0.000195503"
                          y="0.000195503"
                          width="100.4"
                          height="100.4"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feGaussianBlur
                            stdDeviation="2.6"
                            result="effect1_foregroundBlur"
                          />
                        </filter>
                      </defs>
                    </svg>

                    <svg
                      className="vs-mic-ring vs-mic-ring-white"
                      xmlns="http://www.w3.org/2000/svg"
                      width="70"
                      height="70"
                      viewBox="0 0 70 70"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle cx="35" cy="35" r="35" fill="#F7F9FF" />
                    </svg>

                    <span className="vs-mic-icon">
                      <MicIcon />
                    </span>
                  </button>

                  <canvas
                    id="waveCanvas_right"
                    className="vs-wave-canvas"
                    width="150"
                    height="60"
                  />
                </div>
              </div>
            </div>

            {isAnalyzing && (
              <div className="vs-feedback-box">
                <p className="vs-feedback-tag">AI 피드백</p>
                <p className="vs-feedback-main">분석 중이에요...</p>
                <p className="vs-feedback-sub">잠시만 기다려주세요</p>
              </div>
            )}

            {sttResult && !isAnalyzing && (
              <div className="vs-feedback-box">
                <p className="vs-feedback-tag">AI 피드백</p>

                <p className="vs-feedback-main">
                  {sttResult.is_correct
                    ? "발음이 정확해요! 🎉"
                    : `"${sttResult.recognized_text ?? ""}" 로 들렸어요`}
                </p>

                <p className="vs-feedback-sub">
                  {extractFeedbackText(sttResult.feedback)}
                </p>
              </div>
            )}

            {sttError && !isAnalyzing && (
              <div className="vs-feedback-box vs-feedback-error">
                <p className="vs-feedback-tag">오류</p>
                <p className="vs-feedback-main">{sttError}</p>
              </div>
            )}

            {!sttResult && !isAnalyzing && !sttError && (
              <div className="vs-feedback-box">
                <p className="vs-feedback-tag">AI 피드백</p>
                <p className="vs-feedback-main">
                  마이크 버튼을 눌러 발음해보세요
                </p>
                <p className="vs-feedback-sub">
                  녹음이 끝나면 AI가 분석해드려요
                </p>
              </div>
            )}

            <div className="vs-footer">
              <button
                type="button"
                className={`vs-next-btn ${!sttResult ? "disabled" : ""}`}
                onClick={() => sttResult && navigate("/study/complete")}
              >
                학습 완료하기 →
              </button>

              <p className="vs-footer-sub">
                음성 분석을 마치면 학습이 완료돼요
              </p>
            </div>
          </>
        )}
      </div>

    </MobileScreen>
  );
}

export default VowelStudyPage;