import { useState, useEffect } from "react";

export const useTodayDate = () => {
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    setToday(`${yyyy}${mm}${dd}`);
  }, []);

  return today;
};
