import React from "react";
import audio from "../assets/images/audio.png";
import audioActive from "../assets/images/audio-active.png";
import "../styles/LetterDetailCard.css";
import useAudioPlayer from "../hooks/useLetterAudio";
import { TypeAnimation } from "react-type-animation";

const LetterDetailCard = ({
  letter,
  isSender = false,
  isSky = false,
  isReplyLoading = false, // prop 추가
}) => {
  const {
    isPlaying,
    isPaused,
    audioRef,
    handlePlayClick,
    handleAudioPlay,
    handleAudioEnded,
    handleAudioPause,
  } = useAudioPlayer(letter.audio_url);

  const title = letter.title;
  const transcript = isSky ? letter.content_text : letter.transcript;
  const reply = isSky ? letter.reply_text : letter.replies?.[0]?.content;
  const replyAudio = isSky ? letter.reply_voice_url : null;

  // 발신자/수신자 정보 분기
  let senderValue = "";
  let recipientValue = "";

  if (isSky) {
    senderValue = letter.receiver_name || "정보 없음";
    recipientValue = letter.receiver_name || "정보 없음";
  } else {
    senderValue = letter.recipients?.map(r => r.email).join(", ") || "정보 없음";
    recipientValue = letter.sender?.display_id || letter.sender?.email || "정보 없음";
  }

  return (
    <div className={`letterdetail-box letterdetail-${letter.paper_color || letter.color || "gray"}`}>
      {/* 발신자/수신자 정보 */}
      <div className="letterdetail-row">
        <span className="letterdetail-label">
          {isSender ? "수신인ㅣ" : "발신인ㅣ"}
        </span>
        <span className="letterdetail-value">
          {isSender ? senderValue : recipientValue}
        </span>
      </div>

      {/* 제목 */}
      <div className="letterdetail-row">
        <span className="letterdetail-label">제목ㅣ</span>
        <span className="letterdetail-value">
          {title?.slice(0, 15) || "제목 없음"}
        </span>
      </div>

      {/* 텍스트 본문 */}
      <div className="letterdetail-row">
        <span className="letterdetail-label">텍스트 변환ㅣ</span>
        <span className="letterdetail-text">
          {transcript || "내용 없음"}
        </span>
      </div>

      {/* 작성일 */}
      <div className="letterdetail-date">
        {letter.created_at
          ? new Date(letter.created_at).toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "날짜 없음"}
      </div>

      {/* 원본 오디오 */}
      <div className="letterdetail-audio">
        <button className="letterdetail-play" onClick={handlePlayClick}>
          <img
            src={
              isPlaying ? (isPaused ? audio : audioActive) : audio
            }
            alt="play"
            style={{ width: 40, height: 40 }}
          />
        </button>
        <audio
          ref={audioRef}
          src={letter.audio_url}
          onPlay={handleAudioPlay}
          onEnded={handleAudioEnded}
          onPause={handleAudioPause}
        />
      </div>

      {/* 답장: 하늘편지 + 받은편지함 */}
      {isSky && !isSender && (
        <div
          className="letterdetail-reply"
          style={{
            marginTop: "2rem",
            marginBottom: "1.5rem",
            padding: "1.2rem",
            background: "#f8f8f8",
            borderRadius: "12px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="letterdetail-reply-row" style={{ marginBottom: "1rem", display: "flex", flexDirection: "column" }}>
            <span className="letterdetail-reply-label" style={{ fontWeight: 700, fontSize: "2rem" }}>
              ☁️💬
            </span>
            <span className="letterdetail-reply-label-text" style={{ fontWeight: 300, fontSize: "1rem" }}>
              답장
            </span>
          </div>
          <div
            className="letterdetail-reply-text"
            style={{
              fontSize: "1.2rem",
              fontWeight: 400,
              color: "#222",
              marginBottom: replyAudio ? "1rem" : 0,
              wordBreak: "break-all",
              textAlign: "center",
            }}
          >
            {isSky && isReplyLoading ? (
              "AI 답장을 생성 중입니다..."
            ) : (
              reply ? (
                <TypeAnimation
                  sequence={[reply]}
                  wrapper="span"
                  speed={20}
                  style={{ display: "inline-block", whiteSpace: "pre-line" }}
                  cursor={false}
                />
              ) : "답장 없음")}
          </div>
          {replyAudio && (
            <audio controls src={replyAudio} style={{ width: "100%", maxWidth: 400, margin: "0 auto" }} />
          )}
        </div>
      )}
    </div>
  );
};

export default LetterDetailCard;