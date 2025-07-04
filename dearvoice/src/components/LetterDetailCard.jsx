import React from "react";
import audio from "../assets/images/audio.png";
import audioActive from "../assets/images/audio-active.png";
import '../styles/LetterDetailCard.css';

const LetterDetailCard = ({
  letter,
  isPlaying,
  isPaused,
  audioRef,
  handlePlayClick,
  handleAudioPlay,
  handleAudioEnded,
  handleAudioPause,
}) => (
  <div className={`letterdetail-box letterdetail-${letter.color}`}>
    <div className="letterdetail-row">
      <span className="letterdetail-label">수신인ㅣ</span>
      <span className="letterdetail-value">{letter.user}</span>
    </div>
    <div className="letterdetail-row">
      <span className="letterdetail-label">제목ㅣ</span>
      <span className="letterdetail-value">{letter.title}</span>
    </div>
    <div className="letterdetail-row">
      <span className="letterdetail-label">텍스트 변환ㅣ</span>
      <span className="letterdetail-text">{letter.text}</span>
    </div>
    <div className="letterdetail-date">{letter.date}</div>
    <div className="letterdetail-audio">
      <button className="letterdetail-play" onClick={handlePlayClick}>
        <img
          src={
            isPlaying
              ? isPaused
                ? audio
                : audioActive
              : audio
          }
          alt="play"
          style={{ width: 40, height: 40 }}
        />
      </button>
      <audio
        ref={audioRef}
        src={letter.audioUrl}
        onPlay={handleAudioPlay}
        onEnded={handleAudioEnded}
        onPause={handleAudioPause}
      />
    </div>
  </div>
);

export default LetterDetailCard;