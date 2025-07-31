import audio from "../assets/images/audio.png";
import audioActive from "../assets/images/audio-active.png";
import "../styles/LetterDetailCard.css";
import useAudioPlayer from "../hooks/useLetterAudio";

const LetterDetailCard = ({ letter, isSender = false }) => {
  const {
    isPlaying,
    isPaused,
    audioRef,
    handlePlayClick,
    handleAudioPlay,
    handleAudioEnded,
    handleAudioPause,
  } = useAudioPlayer(letter.audio_url);

  console.log("렌더 중인 편지:", letter); // 실제 렌더 여부 확인용

  return (
    <div className={`letterdetail-box letterdetail-${letter.paper_color || "gray"}`}>
      <div className="letterdetail-row">
        <span className="letterdetail-label">
          {isSender ? "수신인ㅣ" : "발신인ㅣ"}
        </span>
        <span className="letterdetail-value">
          {isSender
            ? letter.recipients?.map(r => r.email).join(", ") || "정보 없음"
            : letter.sender?.display_id || letter.sender?.email || "정보 없음"}
        </span>
      </div>
      <div className="letterdetail-row">
        <span className="letterdetail-label">제목ㅣ</span>
        <span className="letterdetail-value">
          {letter.title?.slice(0, 15) || "제목 없음"}
        </span>
      </div>
      <div className="letterdetail-row">
        <span className="letterdetail-label">텍스트 변환ㅣ</span>
        <span className="letterdetail-text">
          {letter.transcript || "내용 없음"}
        </span>
      </div>
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
    </div>
  );
};

export default LetterDetailCard;