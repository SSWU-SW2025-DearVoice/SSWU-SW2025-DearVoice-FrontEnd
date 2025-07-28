import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/LetterDetail.css";
import LetterDetailCard from "../../components/LetterDetailCard";
import useAudioPlayer from "../../hooks/useLetterAudio";
import axios from "axios";

function ReceivedLetterDetail() {
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
    .then((res) => {
      console.log("받은 편지 응답 ✅", res.data);
      setLetter(res.data); // 상태만 업데이트
    })
    .catch((err) => {
      console.error("받은 편지 상세 조회 실패", err);
    });
}, [id]);

// 🔽 읽음 처리 패치 요청은 letter가 로드된 이후 별도 useEffect에서
useEffect(() => {
  if (!letter) return;

  const accessToken = localStorage.getItem("accessToken");

  axios
    .patch(`http://localhost:8000/api/mypage/letter/${id}/read/`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => {
      console.log("읽음 처리 완료 ✅", res.data);
    })
    .catch((err) => {
      console.error("읽음 처리 실패 ❌", err);
    });
}, [letter, id]);

  if (!letter) {
  return <div>편지 또는 오디오 정보를 불러오는 중입니다...</div>;
}

  return (
    <div className="letterdetail-wrapper">
      <div
        className="letterdetail-title"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/mypage/received")}
      >
        내 보관소 - 받은 편지함
      </div>
      <LetterDetailCard letter={letter} isSender={false} />
    </div>
  );
}

export default ReceivedLetterDetail;