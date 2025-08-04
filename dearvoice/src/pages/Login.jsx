import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axiosInstance from "../apis/axios"

const Login = () => {
  const [form, setForm] = useState({
    user_id: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "error"만 사용
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.user_id || !form.password) {
      setModalType("error");
      setShowModal(true);
      return;
    }

    try {
    const response = await axiosInstance.post("/api/auth/login/", form, {
      headers: { "Content-Type": "application/json" }
    });

    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);

    navigate("/home");
    } catch (err) {
      setModalType("error");
      setShowModal(true);
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    // 실패 모달 확인 후 현재 페이지에 머물기
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleFindPasswordClick = () => {
    navigate("/find-password");
  };

  return (
    <div className="mobile-wrapper">
      <div className="login-container">
        <div className="login-title">로그인</div>
        <div className="login-box">
          <div className="login-row">
            <div className="login-field-id">
              <span className="field-label-id">아이디ㅣ</span>
              <input
                type="text"
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                placeholder=""
              />
            </div>
          </div>

          <div className="login-row">
            <div className="login-field-pw">
              <span className="field-label-pw">비밀번호ㅣ</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder=""
              />
            </div>
          </div>

          <div className="login-links">
            <button
              type="button"
              className="link-btn"
              onClick={handleSignupClick}
            >
              회원가입 바로가기
            </button>
            <span className="link-separator">|</span>
            <button
              type="button"
              className="link-btn"
              onClick={handleFindPasswordClick}
            >
              비밀번호 재설정
            </button>
          </div>
        </div>

        <button className="login-submit-btn" onClick={handleLogin}>
        로그인
      </button>

      </div>

      {message && (
        <div className="login-message" style={{ color: "red" }}>
          {message}
        </div>
      )}

      {/* 로그인 실패 모달만 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content">
              <h3>로그인 실패</h3>
              <p>
                {!form.user_id || !form.password
                  ? "아이디와 비밀번호를 모두 입력해주세요."
                  : "아이디 또는 비밀번호를 확인해주세요."}
              </p>
              <button className="modal-btn" onClick={handleModalConfirm}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
