import React from "react";
import useAudioPlayer from "../../hooks/useLetterAudio";
import "../../styles/LetterDetail.css";

function LetterDetailCard({ letter, isSender = false }) {
  const { isPlaying, play, pause } = useAudioPlayer(letter.audio_url);

  return (
    <div className={`letterdetail-card letter-${letter.paper_color}`}>
      <div className="letter-row">
        <strong>{isSender ? "수신인" : "발신인"}</strong> | @
        {isSender
          ? letter.recipients?.[0]?.display_id || letter.recipients?.[0]?.email
          : letter.sender?.display_id || letter.sender?.email}
      </div>
      <div className="letter-row">
        <strong>제목</strong> | {letter.transcript?.slice(0, 15)}...
      </div>
      <div className="letter-row">
        <strong>텍스트 변환</strong> | {letter.transcript}
      </div>
      <div className="letter-date">
        {new Date(letter.created_at).toLocaleString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div className="letter-audio">
        <button onClick={isPlaying ? pause : play}>
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      </div>
    </div>
  );
}

export default LetterDetailCard;