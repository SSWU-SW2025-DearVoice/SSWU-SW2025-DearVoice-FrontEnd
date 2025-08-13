import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosInstance";
import { authStorage } from "../utils/authStorage";

import record from "../assets/images/record.png";
import recordActive from "../assets/images/record-active.png";
import recordCompleted from "../assets/images/record-complete.png";
import sending01 from "../assets/images/sending01.png";
import sending02 from "../assets/images/sending02.png";
import sending03 from "../assets/images/sending03.png";

import { useTodayDate } from "../hooks/useTodayDate";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useSendStatus } from "../hooks/useSendStatus";

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

  const today = useTodayDate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedColor, setSelectedColor] = useState(initColor || "gray");
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [blinkImage, setBlinkImage] = useState(sending01);
  const [letterId, setLetterId] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [response, setResponse] = useState(null);

  const {
    isRecording,
    isRecorded,
    handleRecordClick,
    recordedBlob,
    resetRecorder,
  } = useAudioRecorder();

  const {
    isSending,
    isSent,
    handleSend: handleSendWithStatus,
  } = useSendStatus();

  const textareaRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isSending && !isSent) {
      interval = setInterval(() => {
        setBlinkImage((prev) => (prev === sending01 ? sending02 : sending01));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isSending, isSent]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const maxHeight = 60;
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
    }
  }, [transcript]);

  const setNow = () => {
    const now = new Date();
    setDate(now.toISOString().slice(0, 10));
    setTime(now.toTimeString().slice(0, 5));
  };

  const isFormComplete = title && date && time && isRecorded;

  const handleReplyClick = () => {
    if (letterId) {
      navigate(`/mypage/detail/received/sky/${letterId}`);
    } else {
      alert("답장 페이지로 이동할 편지 ID가 없습니다.");
    }
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
    if (!authStorage.isLoggedIn()) {
      navigate("/login");
      return;
    }

    setIsTranscribing(true);
    try {
      // 1. S3에 업로드
      const s3Url = uploadedUrl || (await uploadToS3(recordedBlob));
      setUploadedUrl(s3Url);
      console.log("S3 업로드 완료:", s3Url);

      // 2. audio_url을 JSON으로 전송
      const response = await axiosInstance.post(
        "/skyvoice/letters/transcribe/",
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

  const sendSkyLetter = async () => {
    if (!authStorage.isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      const s3Url = uploadedUrl || (await uploadToS3(recordedBlob));
      setUploadedUrl(s3Url);

      const payload = {
        receiver_name: name,
        receiver_gender: gender,
        receiver_age: age,
        receiver_type: category,
        color: selectedColor,
        title,
        scheduled_at: `${date}T${time}:00`,
        audio_url: s3Url,
        content_text: transcript,
      };

      const response = await axiosInstance.post("/skyvoice/letters/", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.id) {
        setLetterId(response.data.id);
      }

      setResponse(response.data);
      setShowModal(true);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      } else if (error.response?.status === 400) {
        alert("입력 정보를 확인해주세요.");
      } else {
        alert("하늘 편지 전송에 실패했습니다. 다시 시도해주세요.");
      }
      console.error("API 호출 에러:", error);
    }
  };

  const handleSend = () => {
    handleSendWithStatus(sendSkyLetter);
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
            placeholder={`${today} 하늘 편지`}
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
                음성을 텍스트로 변환 중...
              </div>
            ) : (
              <textarea
                className="transcript-edit"
                ref={textareaRef}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="녹음 완료 후 자동으로 텍스트로 변환됩니다."
                rows={1}
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
          onClick={handleSend}
          disabled={!isFormComplete || isSending}
        >
          전송하기
        </button>
      </div>

      {/* 전송 중 모달 */}
      {isSending && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-content">
              <img className="letterbefore" src={blinkImage} alt="전송 중" />
              <h3>하늘 편지 전송 중</h3>
            </div>
          </div>
        </div>
      )}

      {/* 전송 완료 모달 */}
      {showModal && isSent && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <img className="lettercomplete" src={sending03} alt="전송 완료" />
              <h3>답장이 도착했어요!</h3>
            </div>
            <button className="modal-button" onClick={handleReplyClick}>
              답장 보러가기
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SkyLetter02;
