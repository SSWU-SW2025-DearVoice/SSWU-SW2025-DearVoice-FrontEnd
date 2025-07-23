// import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "../../styles/LetterDetail.css";
// import LetterDetailCard from "../../components/LetterDetailCard";
// import useAudioPlayer from "../../hooks/useLetterAudio";

// const dummyData = [
//   {
//     id: 1,
//     title: "할머니, 안녕하세요!",
//     user: "@kimgrandma",
//     text: "할머니 요즘 날씨가 더워졌는데, 잘 지내고 계시나요? 할머니 요즘 날씨가 더워졌는데, 잘 지내고 계세요?",
//     date: "2025.06.10 8:30 AM",
//     color: "pink",
//     audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
//   },
//   { id: 2, title: "슬픈 하루..", user: "@jeongbami", color: "blue" },
//   {
//     id: 3,
//     title: "내일 노는 거 맞지?",
//     user: "@bobbyindaeyo",
//     text: "아 왤케 연락을 안 봄? 내일 노는 거 맞지? 점심은 뭐 먹을래? 빨리 보고 싶다. 안 본 지 너무 오래됨",
//     date: "2025.06.21 12:21 PM",
//     color: "green",
//     audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
//   },
//   {
//     id: 4,
//     title: "할머니, 안녕하세요sdfsdfdsdff!",
//     user: "@kimgrandmasdfsdfdf",
//     color: "green",
//   },
//   { id: 5, title: "슬픈 하루..", user: "@jeongbami", color: "blue" },
//   { id: 6, title: "새로운 하루", user: "@kimgrandma", color: "pink" },
//   { id: 7, title: "행복한 하루", user: "@jeongbami", color: "blue" },
//   {
//     id: 8,
//     title: "고마워요ㅈㄷㄱㄷㅈㄱㄷㄱㅈㄷㄱㄷ!",
//     user: "@bobbyindaeyo",
//     color: "yellow",
//   },
//   { id: 9, title: "잘 지내시죠?", user: "@kimgrandma", color: "green" },
//   { id: 10, title: "응원합니다", user: "@jeongbami", color: "blue" },
//   { id: 11, title: "새로운 하루", user: "@kimgrandma", color: "pink" },
//   { id: 1, title: "할머니, 안녕하세요!", user: "@kimgrandma", color: "pink" },
//   { id: 2, title: "슬픈 하루..", user: "@jeongbami", color: "blue" },
//   {
//     id: 3,
//     title: "보고 싶다erer!!!",
//     user: "@boeeerbbyindaeyo",
//     color: "yellow",
//   },
//   {
//     id: 4,
//     title: "할머니, 안녕하세요sdfsdfdsdff!",
//     user: "@kimgrandmasdfsdfdf",
//     color: "green",
//   },
//   { id: 5, title: "슬픈 하루..", user: "@jeongbami", color: "blue" },
//   { id: 6, title: "새로운 하루", user: "@kimgrandma", color: "pink" },
//   { id: 7, title: "행복한 하루", user: "@jeongbami", color: "blue" },
//   { id: 8, title: "고마워요!", user: "@bobbyindaeyo", color: "yellow" },
//   {
//     id: 9,
//     title: "잘 지내ㄴㅇㄹㅇㄴㅇㄹㅇ시죠?",
//     user: "@kimㄴㅇㄹㅇgrandma",
//     color: "green",
//   },
//   { id: 10, title: "응원합니다", user: "@jeongbami", color: "blue" },
//   { id: 11, title: "새로운 하루", user: "@kimgrandma", color: "pink" },
//   { id: 1, title: "할머니, 안녕하세요!", user: "@kimgrandma", color: "pink" },
//   { id: 2, title: "슬픈 하루..", user: "@jeongbami", color: "blue" },
//   { id: 3, title: "보고 싶다!!!", user: "@bobbyindaeyo", color: "yellow" },
//   {
//     id: 4,
//     title: "할머니, 안녕하세요sdfsdfdsdff!",
//     user: "@kimgrandmasdfsdfdf",
//     color: "green",
//   },
//   { id: 5, title: "슬픈 하루..", user: "@jeongbami", color: "blue" },
//   { id: 6, title: "새로운 하루", user: "@kimgrandma", color: "pink" },
//   { id: 7, title: "행복한 하루", user: "@jeongbami", color: "blue" },
//   { id: 8, title: "고마워요!", user: "@bobbyindaeyo", color: "yellow" },
//   { id: 9, title: "잘 지내시죠?", user: "@kimgrandma", color: "green" },
//   { id: 10, title: "응원합니다", user: "@jeongbami", color: "blue" },
//   { id: 11, title: "새로운 하루", user: "@kimgrandma", color: "pink" },
// ];

// function SentLetterDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // id는 문자열이므로 숫자로 변환해서 비교
//   const letter = dummyData.find((item) => String(item.id) === String(id));

//   // letter가 없을 때 예외 처리
//   if (!letter) return <div>편지를 찾을 수 없습니다.</div>;

//   const audioProps = useAudioPlayer(letter.audioUrl);

//   return (
//     <div className="letterdetail-wrapper">
//       <div
//         className="letterdetail-title"
//         style={{ cursor: "pointer" }}
//         onClick={() => navigate("/mypage/sent")}
//       >
//         내 보관소 - 보낸 편지함
//       </div>
//       <LetterDetailCard letter={letter} {...audioProps} />
//     </div>
//   );
// }

// export default SentLetterDetail;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/LetterDetail.css";
import LetterDetailCard from "../../components/LetterDetailCard";
import useAudioPlayer from "../../hooks/useLetterAudio";

function SentLetterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLetter = async () => {
      setLoading(true);
      setError(null);

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/letters/detail/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setLetter(response.data);
      } catch (err) {
        setError("편지 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [id, navigate]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!letter) return <div>편지를 찾을 수 없습니다.</div>;

  const audioProps = useAudioPlayer(letter.audio_url || letter.audioUrl);

  return (
    <div className="letterdetail-wrapper">
      <div
        className="letterdetail-title"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/mypage/sent")}
      >
        내 보관소 - 보낸 편지함
      </div>
      <LetterDetailCard letter={letter} {...audioProps} />
    </div>
  );
}

export default SentLetterDetail;
