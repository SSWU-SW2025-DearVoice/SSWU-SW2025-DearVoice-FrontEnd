// src/pages/PublicLetterDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PublicLetterDetail() {
  const { uuid } = useParams();
  const [letter, setLetter] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/letters/share/${uuid}/`)
      .then((res) => {
        setLetter(res.data);
      })
      .catch((err) => {
        setError("편지를 불러올 수 없습니다. 이미 삭제되었거나 잘못된 링크입니다.");
      });
  }, [uuid]);

  if (error) return <div>{error}</div>;
  if (!letter) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{letter.title}</h2>
      <p><strong>내용 (STT):</strong></p>
      <p>{letter.transcript || "음성 텍스트가 없습니다."}</p>
      {letter.audio_url && (
        <audio controls src={letter.audio_url} />
      )}
    </div>
  );
}

export default PublicLetterDetail;