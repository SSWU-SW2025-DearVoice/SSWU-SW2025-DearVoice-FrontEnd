import { useEffect, useState } from "react";
import axios from "axios";

const useLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:8000/skyvoice/list/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLetters(res.data);
      } catch (err) {
        console.error("편지 목록 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  return { letters, loading };
};

export default useLetters;
