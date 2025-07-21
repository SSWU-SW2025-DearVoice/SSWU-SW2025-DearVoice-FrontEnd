import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import record from "../assets/images/record.png";
import recordActive from "../assets/images/record-active.png";
import recordCompleted from "../assets/images/record-complete.png";
import sending01 from "../assets/images/sending01.png";
import sending02 from "../assets/images/sending02.png";
import sending03 from "../assets/images/sending03.png";

const SkyLetter02 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    name,
    gender,
    age,
    category,
    selectedColor: initColor,
  } = location.state || {};

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedColor, setSelectedColor] = useState(initColor || "gray");

  const [isRecorded, setIsRecorded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [blinkImage, setBlinkImage] = useState(sending01);

  useEffect(() => {
    let interval;
    if (isSending && !isSent) {
      interval = setInterval(() => {
        setBlinkImage((prev) => (prev === sending01 ? sending02 : sending01));
      }, 500); // 0.5초마다 깜빡
    }
    return () => clearInterval(interval);
  }, [isSending, isSent]);

  const setNow = () => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5);
    setDate(todayStr);
    setTime(timeStr);
  };

  const handleRecordClick = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecorded(true);
      setIsRecording(false);
    }, 3000);
  };

  const isFormComplete = title && date && time && isRecorded;

  const today = new Date().toISOString().slice(0, 10);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 3000); // 예시: 3초 뒤 전송 완료
  };

  const handleReplyClick = () => {
    navigate("../mypage/detail/received/1"); // 실제 LetterDetailCard.jsx 라우트에 맞게 수정
  };

  return (
    <>
      <div className="mypage-title">
        <h2 className="mypage-top">하늘 편지</h2>
      </div>

      <div className={`letterdetail-box ${selectedColor}`}>
        <div className="letterdetail-row">
          <span className="letterdetail-label">이름ㅣ</span>
          {name}
        </div>

        <div className="letterdetail-row">
          <span className="letterdetail-label">제목ㅣ</span>
          <input
            type="text"
            placeholder={`${today} 음성 편지`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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
          <span className="letterdetail-text"> {/* Placeholder */} </span>
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
          disabled={!isFormComplete}
          onClick={handleSend}
        >
          전송하기
        </button>
      </div>

      {(isSending || isSent) && (
        <div className="overlay">
          <div className="overlay-inner">
            {isSending && (
              <>
                <img src={blinkImage} alt="sending" className="sending-img" />
                <div className="overlay-text">전송 중...</div>
              </>
            )}

            {isSent && (
              <>
                <img src={sending03} alt="sent" className="sending-img" />
                <div className="overlay-text">답장이 도착했어요!</div>
                <button className="reply-btn" onClick={handleReplyClick}>
                  답장 보러가기
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SkyLetter02;
