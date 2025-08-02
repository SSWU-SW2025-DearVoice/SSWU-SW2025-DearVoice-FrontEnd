import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../styles/LetterDetail.css";
import LetterDetailCard from "../../components/LetterDetailCard";
import axios from "axios";

function ReceivedLetterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [letter, setLetter] = useState(null);
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const pollingRef = useRef(null);

  const isSkyLetter = location.pathname.includes("/sky/");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const url = isSkyLetter
      ? `http://localhost:8000/skyvoice/letters/${id}/`
      : `http://localhost:8000/api/letters/${id}/`;

    const fetchLetter = async () => {
      try {
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setLetter(res.data);

        // 하늘편지이고 답장이 없으면 폴링 시작
        if (isSkyLetter && !res.data.reply_text && !pollingRef.current) {
          setIsReplyLoading(true);
          pollingRef.current = setInterval(fetchLetter, 2000);
        }
        // 답장이 오면 폴링 종료
        if (isSkyLetter && res.data.reply_text && pollingRef.current) {
          setIsReplyLoading(false);
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } catch (err) {
        console.error("상세 조회 실패", err);
      }
    };

    fetchLetter();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [id, isSkyLetter]);

  // 일반 편지만 읽음 처리
  useEffect(() => {
    if (!letter || isSkyLetter) return;

    const accessToken = localStorage.getItem("accessToken");

    axios
      .patch(`http://localhost:8000/api/mypage/letter/${id}/read/`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        console.log("읽음 처리 완료", res.data);
      })
      .catch((err) => {
        console.error("읽음 처리 실패", err);
      });
  }, [letter, id, isSkyLetter]);

  if (!letter) {
    return <div>편지를 불러오는 중입니다...</div>;
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

      <LetterDetailCard
        letter={letter}
        isSender={false}
        isSky={isSkyLetter}
        isReplyLoading={isReplyLoading}
      />
    </div>
  );
}

export default ReceivedLetterDetail;