import audio from "../assets/images/audio.png";
import audioActive from "../assets/images/audio-active.png";
import "../styles/LetterDetailCard.css";
import useAudioPlayer from "../hooks/useLetterAudio";

const LetterDetailCard = ({ letter, isSender = false, isSky = false}) => {
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

  const transcript = isSky ? letter.content_text : letter.transcript;
  const reply = isSky ? letter.reply_text : letter.replies?.[0]?.content;
  const replyAudio = isSky ? letter.reply_voice_url : null;

  return (
    <div className={`letterdetail-box letterdetail-${letter.paper_color || "gray"}`}>
      {/* 발신자/수신자 정보 */}
      <div className="letterdetail-row">
        <span className="letterdetail-label">
          {isSender ? "수신인ㅣ" : "발신인ㅣ"}
        </span>
        <span className="letterdetail-value">
          {isSky
            ? isSender
              ? letter.receiver_name || "정보 없음"
              : letter.user?.user_id || "정보 없음"
            : isSender
              ? letter.recipients?.map(r => r.email).join(", ") || "정보 없음"
              : letter.sender?.display_id || letter.sender?.email || "정보 없음"}
        </span>
      </div>

      {/* 제목 (transcript 앞부분) */}
      <div className="letterdetail-row">
        <span className="letterdetail-label">제목ㅣ</span>
        <span className="letterdetail-value">
          {transcript?.slice(0, 15) || "제목 없음"}...
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

      {/* 답장 텍스트/오디오 (있을 때만 표시) */}
      {reply && (
        <div className="letterdetail-reply">
          <div className="letterdetail-row">
            <span className="letterdetail-label">💬 답장ㅣ</span>
            <span className="letterdetail-text">{reply}</span>
          </div>
          {replyAudio && (
            <audio controls src={replyAudio} style={{ marginTop: "0.5rem" }} />
          )}
        </div>
      )}
    </div>
  );
};

export default LetterDetailCard;