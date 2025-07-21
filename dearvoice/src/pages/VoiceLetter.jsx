import React, { useState } from "react";
import "../styles/LetterDetailCard.css";
import "../styles/VoiceLetter.css";

import record from "../assets/images/record.png";
import recordActive from "../assets/images/record-active.png";
import recordCompleted from "../assets/images/record-complete.png";

import { useTodayDate } from "../hooks/useTodayDate";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useSendStatus } from "../hooks/useSendStatus";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VoiceLetter = () => {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("white"); // Letter 모델 기본값에 맞게 수정
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [transcript, setTranscript] = useState(""); // 음성 텍스트 변환 결과
  const [isTranscribing, setIsTranscribing] = useState(false);

  const today = useTodayDate();
  const navigate = useNavigate();

  const { isRecording, isRecorded, recordedBlob, handleRecordClick } =
    useAudioRecorder();

  const { isSending, isSent, handleSend } = useSendStatus();

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
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", recordedBlob);

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

      setTranscript(response.data.transcript);
    } catch (error) {
      console.error("음성 변환 실패:", error.response?.data || error.message);
      alert("음성을 텍스트로 변환하는데 실패했습니다.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const isFormComplete = recipient && date && time && isRecorded; // title 제거 (모델에 없음)

  // sendMyLetter 함수: 녹음 파일과 폼 데이터를 백엔드로 전송하고, transcript 상태 업데이트
  const sendMyLetter = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("receiver_email", recipient);
      formData.append("paper_color", selectedColor);
      formData.append("scheduled_at", `${date}T${time}:00`);
      formData.append("audio_file", recordedBlob);

      // transcript가 있으면 추가
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

      console.log("편지 전송 성공!", response.data);
      alert("음성 편지가 성공적으로 생성되었습니다!");

      // 폼 초기화
      setRecipient("");
      setSelectedColor("white");
      setDate("");
      setTime("");
      setTranscript("");
    } catch (err) {
      console.error("편지 전송 실패:", err.response?.data || err.message);

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
            {["white", "pink", "yellow", "green", "blue", "gray"].map((color) => (
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
            {isRecorded && (
              <button
                className="transcribe-btn"
                onClick={transcribeAudio}
                disabled={isTranscribing}
              >
                {isTranscribing ? "변환 중..." : "음성을 텍스트로 변환"}
              </button>
            )}
            {transcript && (
              <div className="transcript-result">
                <p>변환된 텍스트:</p>
                <div className="transcript-text">{transcript}</div>
              </div>
            )}
          </div>
        </div>

        <div className="letterdetail-row date-time-row">
          <span className="letterdetail-label">예약 전송ㅣ</span>
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
          <div className="datetime-button">
            <button onClick={setNow}>현재 시각으로 설정하기</button>
          </div>
        </div>

        {/* 녹음 완료 후에만 재생바 노출 */}
        {recordedBlob && (
          <audio controls src={URL.createObjectURL(recordedBlob)} />
        )}

        <div className="letterdetail-audio">
          <span className="letterdetail-label">음성 녹음ㅣ</span>
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
          {isRecorded && <p className="record-status">녹음 완료</p>}
          {isRecording && <p className="record-status recording">녹음 중...</p>}
        </div>
      </div>

      <div className="bottomButton">
        <button
          className={`sendButton ${isFormComplete ? "active" : ""}`}
          onClick={() => isFormComplete && handleSend(sendMyLetter)}
          disabled={!isFormComplete || isSending}
        >
          {isSent ? "생성 완료!" : isSending ? "생성 중..." : "편지 생성하기"}
        </button>
      </div>

      {isSending && (
        <div className="overlay">
          <div className="overlay-text">편지 생성 중...</div>
        </div>
      )}
    </>
  );
};

export default VoiceLetter;
