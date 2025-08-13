import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../../styles/LetterDetail.css";
import LetterDetailCard from "../../components/LetterDetailCard";
import axiosInstance from "../../apis/axiosInstance";
import { authStorage } from "../../utils/authStorage";

function SentLetterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [letter, setLetter] = useState(null);

  const isSkyLetter = location.pathname.includes("/sky/");

  useEffect(() => {
    const url = isSkyLetter
      ? `/skyvoice/letters/${id}/`
      : `/api/letters/${id}/`;

    axiosInstance
      .get(url)
      .then(res => {
        console.log("보낸 편지 상세 응답", res.data);
        setLetter(res.data);
      })
      .catch(err => {
        console.error("보낸 편지 상세 조회 실패", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      });
  }, [id, isSkyLetter, navigate]);

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