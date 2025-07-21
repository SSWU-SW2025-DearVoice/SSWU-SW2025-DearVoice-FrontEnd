import { useState } from "react";

export const useSendStatus = () => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSend = async (sendFunction) => {
    setIsSending(true);
    try {
      await sendFunction();
      setIsSent(true);
      setTimeout(() => setIsSent(false), 1500);
    } catch (err) {
      console.error("전송 실패", err);
    } finally {
      setIsSending(false);
    }
  };

  return {
    isSending,
    isSent,
    handleSend,
  };
};
