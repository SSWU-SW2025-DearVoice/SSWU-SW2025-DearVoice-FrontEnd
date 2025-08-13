import React, { useState, useEffect, useRef } from "react";
import "../styles/LetterDetailCard.css";
import "../styles/VoiceLetter.css";

import record from "../assets/images/record.png";
import recordActive from "../assets/images/record-active.png";
import recordCompleted from "../assets/images/record-complete.png";
import letterbefore from "../assets/images/letter-before.png";
import lettercomplete from "../assets/icons/letter-complete.svg";

import { useTodayDate } from "../hooks/useTodayDate";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useSendStatus } from "../hooks/useSendStatus";
import axiosInstance from "../apis/axiosInstance";
import { authStorage } from "../utils/authStorage";
import { useNavigate } from "react-router-dom";

const VoiceLetter = () => {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("gray");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const today = useTodayDate();
  const navigate = useNavigate();

  const {
    isRecording,
    isRecorded,
    recordedBlob,
    handleRecordClick,
    resetRecorder,
  } = useAudioRecorder();

  const { isSending, isSent, setIsSent, handleSend, resetStatus } =
    useSendStatus();

  const textareaRef = useRef(null);

  useEffect(() => {
    if (isSent) {
      setShowModal(true);
    }
  }, [isSent]);

  const handleGoHome = () => {
    setRecipient("");
    setSelectedColor("gray");
    setDate("");
    setTime("");
    setTranscript("");

    resetStatus();

    setShowModal(false);

    navigate("/home");
  };

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

  const uploadToS3 = async (fileBlob) => {
    const formData = new FormData();
    formData.append("file", fileBlob, "recording.wav");

    const response = await axiosInstance.post(
      "/api/letters/upload/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.url;
  };

  const transcribeAudio = async () => {
    if (!recordedBlob) return;

    setIsTranscribing(true);
    try {
      const s3Url = await uploadToS3(recordedBlob);
      setUploadedUrl(s3Url);

      console.log("S3 업로드 완료:", s3Url);

      const response = await axiosInstance.post(
        "/api/letters/transcribe/",
        { audio_url: s3Url },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.transcript) {
        setTranscript(response.data.transcript);
      } else {
        alert("STT 변환 결과를 받지 못했습니다.");
      }
    } catch (error) {
      alert(
        `음성 텍스트 변환 실패: ${error.response?.data?.error || error.message}`
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  useEffect(() => {
    if (isRecorded && recordedBlob) {
      transcribeAudio();
    }
  }, [isRecorded, recordedBlob]);

  const isFormComplete = recipient && date && time && isRecorded;

  console.log("transcript:", transcript);
  console.log("uploadedUrl:", uploadedUrl);
  console.log("recordedBlob:", recordedBlob);

  const sendMyLetter = async () => {
    let payload = {};

    try {
      const s3Url = uploadedUrl || (await uploadToS3(recordedBlob));
      setUploadedUrl(s3Url); 

      payload = {
        recipients: [{ email: recipient }],
        paper_color: selectedColor,
        audio_url: s3Url,
        transcript: transcript,
        title: title,
      };

      if (date && time) {
        const scheduledTime = new Date(`${date}T${time}:00`);
        const now = new Date();
        
        if (scheduledTime > now) {
          payload.scheduled_at = `${date}T${time}:00`;
        }
      }

      console.log("최종 payload:", payload);

      const response = await axiosInstance.post(
        "/api/letters/create/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setIsSent(true);
        return true;
      } else {
        alert("편지 전송 실패: 알 수 없는 오류");
        return false;
      }
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      } else if (err.response?.status === 400) {
        console.log("백엔드 응답:", err.response?.data);
        alert("입력 정보를 확인해주세요.");
        console.log("보낸 데이터:", JSON.stringify(payload));
      } else {
        alert("편지 전송에 실패했습니다. 다시 시도해주세요.");
      }
      return false;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const maxHeight = 60;
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  }, [transcript]);

  return (
    <>
      <div className="mypage-title">
        <h2 className="mypage-top">음성 편지</h2>
      </div>

      <div className={`letterdetail-box ${selectedColor}`}>
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
          <div className="letterdetail-text">
            {isTranscribing ? (
              <div style={{ color: "#007bff", fontSize: "14px" }}>
                음성을 텍스트로 변환 중..
              </div>
            ) : (
              <textarea
                className="transcript-edit"
                ref={textareaRef}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="녹음 완료 후 자동으로 텍스트로 변환됩니다."
                rows={1}
                style={{
                  overflowY: "auto",
                  maxHeight: "60px",
                  minHeight: "20px",
                  height: "auto",
                }}
              />
            )}
          </div>
        </div>

        <div className="letterdetail-row date-time-row">
          <div className="datetime-set">
            <span className="letterdetail-label">시간 설정ㅣ</span>
            <button className="setNowButton" onClick={setNow}>
              현재 시각으로
            </button>
          </div>
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
        {isRecorded && (
          <div className="letterdetail-row date-time-row">
            <div className="recordResult">
              <span className="letterdetail-label">녹음 듣기ㅣ</span>
              <button
                onClick={() => {
                  resetRecorder();
                  setUploadedUrl(null);
                  setTranscript("");
                }}
                className="reRecordButton"
              >
                재녹음
              </button>
            </div>
            {recordedBlob && (
              <audio
                controls
                src={URL.createObjectURL(recordedBlob)}
                className="custom-audio"
              />
            )}
          </div>
        )}

        <div className="letterdetail-audio">
          <button
            className="letterdetail-play"
            onClick={handleRecordClick}
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
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
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
