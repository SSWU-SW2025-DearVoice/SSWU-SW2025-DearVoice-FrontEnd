// SkyLetterDetail.js
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import '../../styles/SkyVoiceLetterDetail.css';
import axios from "axios";

const SkyVoiceLetterDetail = () => {
  const { id } = useParams();
  const [letter, setLetter] = useState(null);
  const [isReplyLoading, setIsReplyLoading] = useState(false);
  const pollingRef = useRef();

  useEffect(() => {
    const fetchLetter = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`http://127.0.0.1:8000/skyvoice/letters/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setLetter(res.data);
        // 답장이 없으면 폴링 시작
        if (!res.data.reply_text && !pollingRef.current) {
          setIsReplyLoading(true);
          pollingRef.current = setInterval(fetchLetter, 2000);
        }
        // 답장이 생성되면 폴링 종료
        if (res.data.reply_text && pollingRef.current) {
          setIsReplyLoading(false);
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } catch (err) {
        console.error("편지 로딩 실패", err);
      }
    };

    fetchLetter();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [id]);

  if (!letter) return <div>불러오는 중...</div>;

  return (
    <div className={`letterdetail-box letterdetail-${letter.color || "gray"}`}>
      <div className="letterdetail-row">
        <span className="letterdetail-label">수신인ㅣ</span>
        <span className="letterdetail-value">{letter.receiver_name || "정보 없음"}</span>
      </div>
      <div className="letterdetail-row">
        <span className="letterdetail-label">제목ㅣ</span>
        <span className="letterdetail-value">{letter.title?.slice(0, 15) || "제목 없음"}</span>
      </div>
      <div className="letterdetail-row">
        <span className="letterdetail-label">보낸 편지ㅣ</span>
        <span className="letterdetail-sky">{letter.content_text || "내용 없음"}</span>
      </div>
      <div className="letterdetail-row">
        <span className="letterdetail-label">답장ㅣ</span>
        <span className="letterdetail-value">
          {isReplyLoading
            ? "AI 답장을 생성 중입니다..."
            : letter.reply_text || "아직 생성되지 않았어요."}
        </span>
      </div>
      <div className="letterdetail-date">
        {letter.created_at
          ? new Date(letter.created_at).toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "날짜 없음"}
      </div>
      {letter.reply_voice_url && (
        <audio controls src={letter.reply_voice_url} />
      )}
    </div>
  );
};

export default SkyVoiceLetterDetail;
