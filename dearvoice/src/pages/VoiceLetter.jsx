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

const VoiceLetter = () => {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("gray");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const today = useTodayDate();

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

  const isFormComplete = recipient && title && date && time && isRecorded;

  const sendMyLetter = async () => {
    const formData = new FormData();
    formData.append("recipient", recipient);
    formData.append("title", title);
    formData.append("color", selectedColor);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("audio", recordedBlob);

    await axios.post("/api/send", formData);
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
              type="text"
              placeholder="@받는 사람 아이디 or 이메일 주소"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </span>
        </div>

        <div className="letterdetail-row">
          <span className="letterdetail-label">제목ㅣ</span>
          <span className="letterdetail-input">
            <input
              type="text"
              placeholder={`${today} 음성 편지`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </span>
        </div>

        <div className="letterdetail-row">
          <span className="letterdetail-label">편지지 색상ㅣ</span>
          <div className="color-options">
            {["gray", "pink", "yellow", "green", "blue"].map((color) => (
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
          {/* 음성 텍스트 변환 결과 표시 위치 */}
        </div>

        <div className="letterdetail-row date-time-row">
          <div className="datetime-inputs">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="datetime-button">
            <button onClick={setNow}>현재 시각으로 설정하기</button>
          </div>
        </div>

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
        >
          {isSent ? "전송 완료!" : "전송하기"}
        </button>
      </div>

      {isSending && (
        <div className="overlay">
          <div className="overlay-text">전송 중...</div>
        </div>
      )}
    </>
  );
};

export default VoiceLetter;
