// 📄 SentLetterDetail.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/LetterDetail.css";
import LetterDetailCard from "../../components/LetterDetailCard";
import useAudioPlayer from "../../hooks/useLetterAudio";
import axios from "axios";

function SentLetterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    axios.get(`http://localhost:8000/letters/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
       console.log("상세 응답:", res.data); // ✅ 추가
    setLetter(res.data);
  })
    .catch(err => console.error("보낸 편지 상세 조회 실패", err));
  }, [id]);

  if (!letter) return <div>편지를 불러오는 중입니다...</div>;
  console.log("부모에서 전달하는 letter:", letter);

  return (
    <div className="letterdetail-wrapper">
      <div
        className="letterdetail-title"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/mypage/sent")}
      >
        내 보관소 - 보낸 편지함
      </div>
      <LetterDetailCard letter={letter} isSender={true} />
    </div>
  );
}

export default SentLetterDetail;