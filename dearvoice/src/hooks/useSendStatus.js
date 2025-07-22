import { useState } from "react";

export const useSendStatus = () => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSend = async (sendFunction) => {
    setIsSending(true);
    try {
      await sendFunction();
      setIsSent(true); // 모달 뜸 - 자동으로 사라지지 않음
    } catch (err) {
      console.error("전송 실패", err);
    } finally {
      setIsSending(false);
    }
  };

  // 상태 초기화 함수 추가
  const resetStatus = () => {
    setIsSending(false);
    setIsSent(false);
  };

  return {
    isSending,
    isSent,
    setIsSent,
    handleSend,
    resetStatus,
  };
};
