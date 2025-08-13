import '../styles/Navbar.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axiosInstance";
import { authStorage } from "../utils/authStorage";

const NavBar = ({ onClose }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({ open: false, message: "" });

  const handleMove = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    authStorage.clearTokens();
    navigate("/");
    if (onClose) onClose();
  };

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
    if (!password.trim()) {
      setAlertModal({ open: true, message: "비밀번호를 입력해주세요." });
      return;
    }
    setIsLoading(true);
    try {
      await axiosInstance.delete("/api/mypage/delete-account/", {
        data: {
          password: password,
        },
      });

      setShowModal(false);
      setAlertModal({ open: true, message: "회원 탈퇴가 완료되었습니다." });
      authStorage.clearTokens();
      setTimeout(() => {
        setAlertModal({ open: false, message: "" });
        navigate("/");
        if (onClose) onClose();
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.error || "탈퇴 중 오류가 발생했습니다.";
      setAlertModal({ open: true, message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <ul className="nablist">
      <li onClick={handleLogout} className="logout">로그아웃</li>
      <li onClick={handleDeleteAccount} className="signout">회원 탈퇴</li>
      <hr className="nablist-container" />
      <li className="nablist-first" onClick={() => handleMove("/voice")}>음성 편지</li>
      <li className="nablist-sec" onClick={() => handleMove("/sky")}>하늘 편지</li>
      <li className="nablist-third" onClick={() => handleMove("/mypage")}>내 보관소</li>
    </ul>

      {showModal && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
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

      {alertModal.open && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
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
                  fontWeight: 700,
                  fontSize: "1.3rem"
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
    </>
  );
};

export default NavBar;
