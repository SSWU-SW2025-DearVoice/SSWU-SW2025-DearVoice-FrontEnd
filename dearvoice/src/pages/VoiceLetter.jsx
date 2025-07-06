import React, { useState, useEffect } from "react";
import "../styles/LetterDetailCard.css";
import "../styles/VoiceLetter.css";
import record from "../assets/images/record.png";
import recordActive from "../assets/images/record-active.png";
import recordCompleted from "../assets/images/record-complete.png";

const VoiceLetter = ({ letter }) => {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");

  const [today, setToday] = useState("");
  const [selectedColor, setSelectedColor] = useState("gray");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [isRecording, setIsRecording] = useState(false); // 녹음 중 여부
  const [isRecorded, setIsRecorded] = useState(false); // 녹음 완료 여부
  const [mediaRecorder, setMediaRecorder] = useState(null); // MediaRecorder 객체
  const [recordedBlob, setRecordedBlob] = useState(null); // 녹음된 음성

  const [isSent, setIsSent] = useState(false);

  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const todayString = `${yyyy}${mm}${dd}`;
    setToday(todayString);
  }, []);

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

  const handleRecordClick = async () => {
    if (isRecorded) return; // 완료된 후엔 클릭 비활성화

    if (!isRecording) {
      // 🎤 녹음 시작
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordedBlob(blob);
        setIsRecording(false);
        setIsRecorded(true);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } else {
      // ⏹ 녹음 중지
      mediaRecorder.stop();
    }
  };

  const handleSend = async () => {
    if (!isFormComplete) return;

    setIsSending(true); // 오버레이 표시

    try {
      // 예시용 데이터
      const yourData = {
        recipient,
        title,
        color: selectedColor,
        date,
        time,
        // ...etc
      };

      await axios.post("/api/send", yourData);
      setIsSent(true); // 전송 성공 후 버튼 색 변경
    } catch (err) {
      console.error("전송 실패", err);
    } finally {
      setIsSending(false); // 오버레이 숨김
    }
  };

  const isFormComplete = recipient && title && date && time && isRecorded;

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
          {/* <span className="letterdetail-text">{letter.text}</span> */}
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
            disabled={isRecorded} // 녹음 완료되면 버튼 비활성화
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
          onClick={() => {
            if (!isFormComplete) return;
            setIsSent(true); // 전송 실행
            setTimeout(() => setIsSent(false), 1000); // 1초 후 다시 회색
          }}
        >
          전송하기
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
