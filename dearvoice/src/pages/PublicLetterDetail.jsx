import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "../apis/axios";
import "../styles/LetterDetailCard.css";

function PublicLetterDetail() {
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);
  const { uuid } = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get(`/api/letters/share/${uuid}/`)
      .then((res) => {
        setLetter(res.data);
      })
      .catch(() => {
        setError("편지를 불러올 수 없습니다. 이미 삭제되었거나 잘못된 링크입니다.");
      });
  }, [uuid]);

  if (error) return <div>{error}</div>;
  if (!letter) return <div>로딩 중...</div>;

  const handleSendClick = () => {
    navigate("/login?redirect=/send");
  };

  return (
    <div className={`public-letterdetail-box letterdetail-${letter.paper_color || letter.color || "gray"}`}>
      {/* 발신자/수신자 정보 */}
      <div className="letterdetail-row">
        <span className="letterdetail-label">발신인ㅣ</span>
        <span className="letterdetail-value">
          {letter.sender?.display_id || letter.sender?.email || "알 수 없음"}
        </span>
      </div>
      <div className="letterdetail-row">
        <span className="letterdetail-label">수신인ㅣ</span>
        <span className="letterdetail-value">
          {letter.recipients && letter.recipients.length > 0
            ? letter.recipients.map(r => r.email).join(", ")
            : "정보 없음"}
        </span>
      </div>
      {/* 제목 */}
      <div className="letterdetail-row">
        <span className="letterdetail-label">제목ㅣ</span>
        <span className="letterdetail-value">
          {letter.title?.slice(0, 15) || "제목 없음"}
        </span>
      </div>
      {/* 텍스트 변환 */}
      <div className="letterdetail-row">
        <span className="letterdetail-label">텍스트 변환ㅣ</span>
        <span className="letterdetail-text">
          {letter.transcript || letter.content_text || "내용 없음"}
        </span>
      </div>
      {/* 오디오 플레이어 */}
      {letter.audio_url && (
        <div className="letterdetail-audio" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "4px",
        }}>
          <audio
            controls
            src={letter.audio_url}
            style={{
              width: "100%",
              maxWidth: 400,
              borderRadius: "12px",
              background: "#f8f8f8",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          />
        </div>
      )}
      {/* 날짜 */}
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
      {/* 로그인 안내 */}
        <button className="letterdetail-loginbtn" onClick={handleSendClick}>
          로그인하고 보내기
        </button>
    </div>
  );
}

export default PublicLetterDetail;