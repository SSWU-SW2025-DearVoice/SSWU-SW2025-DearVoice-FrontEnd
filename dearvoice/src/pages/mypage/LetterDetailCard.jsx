import React from "react";
import useAudioPlayer from "../../hooks/useLetterAudio";
import "../../styles/LetterDetail.css";

function LetterDetailCard({ letter, isSender = false }) {
  const { isPlaying, play, pause } = useAudioPlayer(letter.audio_url);
  console.log("렌더 중인 편지:", letter); //지금 이거 콘솔창에 안 뜸 근데 이 카드 UI는 불러와지고 값들만 안 뜨니까 데이터가 안 불러진 듯

  return (
    <div className={`letterdetail-card letter-${letter.paper_color || "gray"}`}>
      <div className="letter-row">
        <strong>{isSender ? "수신인" : "발신인"}</strong> | @
        {isSender
          ? letter.recipients?.[0]?.display_id || letter.recipients?.[0]?.email || "정보 없음"
          : letter.sender?.display_id || letter.sender?.email || "정보 없음"}
      </div>
      <div className="letter-row">
        <strong>제목</strong> | {letter.transcript?.slice(0, 15) || "제목 없음"}...
      </div>
      <div className="letter-row">
        <strong>텍스트 변환</strong> | {letter.transcript || "내용 없음"}
      </div>
      <div className="letter-date">
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
      <div className="letter-audio">
        <button onClick={isPlaying ? pause : play}>
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        {letter.audio_url ? (
          <audio src={letter.audio_url} controls style={{ width: "100%" }} />
        ) : (
          <span>오디오 파일 없음</span>
        )}
      </div>
    </div>
  );
}

export default LetterDetailCard;