//mypage letterdetailcard에서 전달된 음성 듣기 로직
import { useRef, useState } from "react";

export default function useAudioPlayer(audioUrl) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef(null);

  const handlePlayClick = () => {
    if (!isPlaying) {
      audioRef.current.play();
      setIsPaused(false);
    } else if (!isPaused) {
      audioRef.current.pause();
      setIsPaused(true);
    } else {
      audioRef.current.play();
      setIsPaused(false);
    }
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setIsPaused(false);
  };
  const handleAudioPause = () => {
    if (audioRef.current && audioRef.current.currentTime < audioRef.current.duration) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    isPaused,
    audioRef,
    handlePlayClick,
    handleAudioPlay,
    handleAudioEnded,
    handleAudioPause,
  };
}