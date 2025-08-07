import { useState } from "react";

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const handleRecordClick = async () => {
    if (isRecorded && !isRecording) return; // 녹음 완료 후에 녹음 중이 아니면 무시
    // 즉, 녹음 중일 때는 중단 가능하게

    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wev" }); // 기존대로 .wev 유지하세요
        setRecordedBlob(blob);
        setIsRecording(false);
        setIsRecorded(true);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } else {
      mediaRecorder.stop();
    }
  };

  // resetRecorder에서 녹음 중이면 종료시키도록
  const resetRecorder = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop(); // 녹음 중이면 종료
    }
    setIsRecording(false);
    setIsRecorded(false);
    setMediaRecorder(null);
    setRecordedBlob(null);
  };

  return {
    isRecording,
    isRecorded,
    recordedBlob,
    handleRecordClick,
    resetRecorder,
  };
};
