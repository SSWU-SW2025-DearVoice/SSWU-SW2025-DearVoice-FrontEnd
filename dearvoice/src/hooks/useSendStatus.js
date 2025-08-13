import { useState } from "react";

export const useSendStatus = () => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSend = async (sendFunction) => {
    setIsSending(true);
    try {
      const result = await sendFunction();
      if (result !== false) {
        setIsSent(true);
      }
    } catch (err) {
      console.error("전송 실패", err);
    } finally {
      setIsSending(false);
    }
  };

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
