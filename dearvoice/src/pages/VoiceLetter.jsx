import React, { useState, useEffect } from "react";
import "../styles/LetterDetailCard.css";
import "../styles/VoiceLetter.css";

import record from "../assets/images/record.png";
import recordActive from "../assets/images/record-active.png";
import recordCompleted from "../assets/images/record-complete.png";
import letterbefore from "../assets/images/letter-before.png";
import lettercomplete from "../assets/images/letter-complete.svg";

import { useTodayDate } from "../hooks/useTodayDate";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useSendStatus } from "../hooks/useSendStatus";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VoiceLetter = () => {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("pink");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const today = useTodayDate();
  const navigate = useNavigate();

  const { isRecording, isRecorded, recordedBlob, handleRecordClick } =
    useAudioRecorder();

  const { isSending, isSent, setIsSent, handleSend, resetStatus } =
    useSendStatus();

  // 편지 생성 완료 시 모달 표시
  useEffect(() => {
    if (isSent) {
      setShowModal(true);
    }
  }, [isSent]);

  // 홈으로 이동 함수
  const handleGoHome = () => {
    // 폼 초기화
    setRecipient("");
    setSelectedColor("pink");
    setDate("");
    setTime("");
    setTranscript("");

    // 전송 상태 초기화
    resetStatus(); // 또는 setIsSent(false)

    // 모달 닫기
    setShowModal(false);

    // 홈으로 이동
    navigate("/home");
  };

  // ESC 키로 모달 닫기 방지
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showModal) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  const setNow = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setDate(`${yyyy}-${mm}-${dd}`);

    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    setTime(`${hh}:${min}`);
  };

  // 음성을 텍스트로 변환하는 함수
  const transcribeAudio = async () => {
    if (!recordedBlob) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    } //protectedlayout 처리하면 자동으로 안 들어가지게

    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio_file", recordedBlob);

      const response = await axios.post(
        "http://127.0.0.1:8000/letters/transcribe/", //음성을 텍스트로 변환
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.transcript) {
        setTranscript(response.data.transcript);
      } else {
      }
    } catch (error) {
      alert(
        `음성을 텍스트로 변환하는데 실패했습니다: ${
          error.response?.data?.error || error.message
        }`
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  // 녹음 완료 시 자동 변환
  useEffect(() => {
    if (isRecorded && recordedBlob) {
      transcribeAudio();
    }
  }, [isRecorded, recordedBlob]);

  const isFormComplete = recipient && date && time && isRecorded;

  // 편지 생성
  const sendMyLetter = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("receiver_email", recipient);
      formData.append("paper_color", selectedColor);
      formData.append("scheduled_at", `${date}T${time}:00`);
      formData.append("audio_file", recordedBlob);

      if (transcript) {
        formData.append("transcript", transcript);
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/letters/create/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 편지 생성 응답에서 transcript 업데이트
      if (response.data && response.data.transcript) {
        setTranscript(response.data.transcript);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      } else if (err.response?.status === 400) {
        alert("입력 정보를 확인해주세요.");
      } else {
        alert("편지 전송에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <>
      <div className="mypage-title">
        <h2 className="mypage-top">음성 편지</h2>
      </div>

      <div className={`letterdetail-box letterdetail-audio ${selectedColor}`}>
        <div className="letterdetail-row">
          <span className="letterdetail-label">수신인ㅣ</span>
          <span className="letterdetail-input">
            <input
              type="email"
              placeholder="받는 사람 이메일 주소"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />
          </span>
        </div>

        <div className="letterdetail-row">
          <span className="letterdetail-label">편지지 색상ㅣ</span>
          <div className="color-options">
            {["pink", "yellow", "green", "blue", "gray"].map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`color-btn ${color} ${
                  selectedColor === color ? "selected" : ""
                }`}
              />
            ))}
          </div>
        </div>

        <div className="letterdetail-row">
          <span className="letterdetail-label">텍스트 변환ㅣ</span>
          <div className="letterdetail-text">
            {isTranscribing ? (
              <div style={{ color: "#007bff", fontSize: "14px" }}>
                음성을 텍스트로 변환 중..
              </div>
            ) : transcript && transcript.length > 0 ? (
              <div className="transcript-result">
                <div className="transcript-text">{transcript}</div>
              </div>
            ) : isRecorded ? (
              <div style={{ color: "#999", fontSize: "14px" }}>
                텍스트 변환을 준비 중입니다.
              </div>
            ) : (
              <div style={{ color: "#999", fontSize: "14px" }}>
                녹음 완료 후 자동으로 텍스트로 변환됩니다.
              </div>
            )}
          </div>
        </div>

        <div className="letterdetail-row date-time-row">
          <span className="letterdetail-label-exception">
            시간 설정ㅣ
            <button className="datetime-button" onClick={setNow}>
              현재 시각으로
            </button>
          </span>
          <div className="datetime-inputs">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        {recordedBlob && (
          <audio
            controls
            src={URL.createObjectURL(recordedBlob)}
            className="custom-audio"
          />
        )}

        <div className="letterdetail-audio">
          <button
            className="letterdetail-play"
            onClick={handleRecordClick}
            disabled={isRecorded}
          >
            <img
              src={
                isRecorded
                  ? recordCompleted
                  : isRecording
                  ? recordActive
                  : record
              }
              alt="record"
              style={{ width: 40, height: 40 }}
            />
          </button>
        </div>
      </div>

      <div className="bottomButton">
        <button
          className={`sendButton ${isFormComplete ? "active" : ""}`}
          onClick={() => isFormComplete && handleSend(sendMyLetter)}
          disabled={!isFormComplete || isSending}
        >
          전송하기
        </button>
      </div>

      {/* 편지 전송 중 모달 */}
      {isSending && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-content">
              <img className="letterbefore" src={letterbefore} alt="전송 중" />
              <h3>음성 편지 전송 중</h3>
            </div>
          </div>
        </div>
      )}

      {/* 편지 전송 완료 모달 */}
      {showModal && isSent && (
        <div
          className="modal-overlay"
          onClick={(e) => e.stopPropagation()} // 배경 클릭 방지
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()} // 모달 클릭 시 이벤트 전파 방지
          >
            <div className="modal-content">
              <img
                className="lettercomplete"
                src={lettercomplete}
                alt="전송 완료"
              />
              <h3>음성 편지 전송 완료!</h3>
              <button className="modal-button" onClick={handleGoHome}>
                홈으로
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceLetter;
