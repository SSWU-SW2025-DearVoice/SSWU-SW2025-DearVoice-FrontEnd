import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/FindPassword.css";
import letterlogo from "../assets/images/letter-before.png"

const FindPassword = () => {
  const [form, setForm] = useState({
    user_id: "",
    email: ""
  });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMessage("");
    
    try {
      // 아이디와 이메일 일치 확인
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/check-user-email/`, {
        user_id: form.user_id,
        email: form.email
      });
      
      // 일치하면 비밀번호 재설정 이메일 전송
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/send-password-reset/`, {
        user_id: form.user_id,
        email: form.email
      });
      
      setModalType("success");
      setShowModal(true);
    } catch (err) {
      setModalType("error");
      setShowModal(true);
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (modalType === "success") {
      navigate("/login");
    }
    // 실패 시에는 현재 페이지에 머물러서 다시 시도할 수 있게
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <div className="mobile-wrapper">
      <div className="find-password-container">
        <div className="find-password-title">비밀번호 재설정</div>
        
        <div className="find-password-box">
          <div className="find-password-row">
            <div className="find-password-field">
              <span className="field-label">아이디ㅣ</span>
              <input 
                type="text" 
                name="user_id" 
                value={form.user_id}
                onChange={handleChange}
                placeholder=""
              />
            </div>
          </div>
          
          <div className="find-password-row">
            <div className="find-password-field">
              <span className="field-label">이메일ㅣ</span>
              <input 
                type="email" 
                name="email" 
                value={form.email}
                onChange={handleChange}
                placeholder=""
              />
            </div>
          </div>
          
          <div className="find-password-links">
            <button type="button" className="link-btn" onClick={handleSignupClick}>
              회원가입 바로가기
            </button>
            <span className="link-separator">|</span>
            <button type="button" className="link-btn" onClick={handleLoginClick}>
              로그인 바로가기
            </button>
          </div>
        </div>
         <button className="find-password-btn" onClick={handleSubmit}>
        비밀번호 재설정
      </button>
      </div>
      
      {message && (
        <div className="find-password-message" style={{ color: "red" }}>
          {message}
        </div>
      )}

      {/* 결과 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <img src={letterlogo}></img>
            <div className="modal-content">
              {modalType === "success" ? (
                <>
                  <h3>메일함을 확인해주세요!</h3>
                </>
              ) : (
                <>
                  <h3>아이디와 이메일이 일치하지 않습니다.</h3>
                </>
              )}
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

export default FindPassword;