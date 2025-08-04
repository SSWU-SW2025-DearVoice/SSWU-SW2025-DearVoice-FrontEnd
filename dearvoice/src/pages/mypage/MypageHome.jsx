import React, { useState } from 'react'
import '../../styles/MypageHome.css'
import sentimg from "../../assets/images/letter-after.png";
import receivedimg from "../../assets/images/letter-before.png";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../apis/axios";

const MypageHome = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({ open: false, message: "" });

  const handleDeleteAccount = () => {
    setShowModal(true);
    setPassword("");
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPassword("");
  };

  const handleAlertModalClose = () => {
    setAlertModal({ open: false, message: "" });
  };

  const handleModalConfirm = async () => {
    if (!password) {
      setAlertModal({ open: true, message: "비밀번호를 입력해주세요." });
      return;
    }
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");
    try {
      await axiosInstance.delete("/api/mypage/delete-account/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          password: password,
        },
      });

      setShowModal(false);
      setAlertModal({ open: true, message: "회원 탈퇴가 완료되었습니다." });
      localStorage.removeItem("accessToken");
      setTimeout(() => {
        setAlertModal({ open: false, message: "" });
        navigate("/login");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.error || "탈퇴 중 오류가 발생했습니다.";
      setAlertModal({ open: true, message });
    } finally {
      setIsLoading(false);
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

      <div className="mypage-signout">
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

      {/* 탈퇴 확인 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <h3>정말 탈퇴하시겠습니까?</h3>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: "100%", padding: "0.5rem", marginBottom: "1rem", marginTop: "0.5rem", borderRadius: "6px", border: "1px solid #ccc",
                }}
                disabled={isLoading}
              />
              <div style={{display: "flex", justifyContent: "flex-end", gap: "0.5rem"}}>
                <button onClick={handleModalClose} disabled={isLoading} style={{padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", border: "1px solid #ccc", background: "#eee"}}>
                  취소
                </button>
                <button onClick={handleModalConfirm} disabled={isLoading} style={{padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", border: "1px solid #F9CB73", background: "#F9CB73", color: "#fff"}}>
                  {isLoading ? "탈퇴 중..." : "탈퇴"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 알림 모달 */}
      {alertModal.open && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <div
                style={{
                  margin: "1.5rem 0",
                  textAlign: "center",
                  color:
                    alertModal.message === "회원 탈퇴가 완료되었습니다."
                      ? "#2e7d32"
                      : "#d32f2f",
                  fontWeight: 600,
                  fontSize: "1.1rem"
                }}
              >
                {alertModal.message}
              </div>
              {alertModal.message !== "회원 탈퇴가 완료되었습니다." && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={handleAlertModalClose}
                    style={{
                      padding: "0.5rem 1.5rem",
                      borderRadius: "6px",
                      border: "1px solid #F9CB73",
                      background: "#F9CB73",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    확인
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MypageHome;