import React from 'react'
import '../../styles/MypageHome.css'
import sentimg from "../../assets/images/letter-after.png";
import receivedimg from "../../assets/images/letter-before.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const MypageHome = () => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("정말 탈퇴하시겠습니까?");
    if (!confirmDelete) return;

    const password = prompt("비밀번호를 입력해주세요:");
    if (!password) return;

    const token = localStorage.getItem("access_token");
    try {
      await axios.delete("/api/mypage/delete-account/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          password: password,
        },
      });

      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.removeItem("access_token");
      navigate("/login");

    } catch (error) {
      const message = error.response?.data?.error || "탈퇴 중 오류가 발생했습니다.";
      alert(message);
    }
  };


  return (
    <div className="mypage-title">
      <h2 className="mypage-top">내 보관소</h2>
      <div className="mypage-container">
        <button
          className="mypage-sent"
          onClick={() => navigate("/mypage/sent")}
        >
          <img src={sentimg} className='sentimg' alt="보낸 편지함"/>
          <div className="sent-text">보낸 편지함</div>
        </button>
        <button className="mypage-received"
        onClick={() => navigate("/mypage/received")} >
          <div className="circle"></div>
          <img src={receivedimg} className='receivedimg' alt="받은 편지함"/>
          <div className="received-text">받은 편지함</div>
        </button>
      </div>

      {/* 👇 회원탈퇴 버튼 추가 */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button
          onClick={handleDeleteAccount}
          style={{
            backgroundColor: "transparent",
            border: "1px solid red",
            color: "red",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  )
}

export default MypageHome;