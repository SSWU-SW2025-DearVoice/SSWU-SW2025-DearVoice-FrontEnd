import { useEffect, useState } from "react";
import axios from "axios";

const useLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/letters/list/", {
        //   .get("http://127.0.0.1:8000/letters/list/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // 백틱 사용
        },
      })
      .then((res) => {
        setLetters(res.data);
      })
      .catch((err) => {
        console.error("레터 가져오기 실패", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { letters, loading };
};

export default useLetters;
