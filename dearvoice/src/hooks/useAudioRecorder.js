import { useState } from "react";

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isRecorded, setIsRecorded] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const handleRecordClick = async () => {
    if (isRecorded && !isRecording) return;


    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wev" });
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

  const resetRecorder = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
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
