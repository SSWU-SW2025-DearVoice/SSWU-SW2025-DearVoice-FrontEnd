import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../../styles/LetterDetail.css";
import LetterDetailCard from "../../components/LetterDetailCard";
import axios from "axios";

function SentLetterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [letter, setLetter] = useState(null);

  const isSkyLetter = location.pathname.includes("/sky/");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const url = isSkyLetter
      ? `http://localhost:8000/skyvoice/letters/${id}/`
      : `http://localhost:8000/api/letters/${id}/`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => {
        console.log("보낸 편지 상세 응답", res.data);
        setLetter(res.data);
      })
      .catch(err => {
        console.error("보낸 편지 상세 조회 실패", err);
      });
  }, [id, isSkyLetter]);

  if (!letter) return <div>편지를 불러오는 중입니다...</div>;

  return (
    <div className="letterdetail-wrapper">
      <div
        className="letterdetail-title"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/mypage/sent")}
      >
        내 보관소 - 보낸 편지함
      </div>
      <LetterDetailCard letter={letter} isSender={true} isSky={isSkyLetter} />
    </div>
  );
}

export default SentLetterDetail;