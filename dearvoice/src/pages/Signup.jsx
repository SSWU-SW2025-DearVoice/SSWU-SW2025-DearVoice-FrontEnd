import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Signup.css";
import letterlogo from "../assets/images/letter-before.png";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    user_id: "",
    password: "",
    passwordConfirm: "",
  });
  const [message, setMessage] = useState("");
  const [emailCheck, setEmailCheck] = useState({ status: "", message: "" });
  const [idCheck, setIdCheck] = useState({ status: "", message: "" });
  const [passwordLengthCheck, setPasswordLengthCheck] = useState({
    status: "",
    message: "",
  });
  const [passwordCheck, setPasswordCheck] = useState({
    status: "",
    message: "",
  });
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 이메일 자동 중복확인 (임시)
  useEffect(() => {
    if (form.email) {
      const timer = setTimeout(() => {
        try {
          // 임시로 이메일 형식만 체크
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(form.email)) {
            setEmailCheck({
              status: "success",
              message: "사용 가능한 이메일입니다.",
            });
          } else {
            setEmailCheck({
              status: "error",
              message: "올바른 이메일 형식이 아닙니다.",
            });
          }
        } catch (err) {
          setEmailCheck({
            status: "error",
            message: "이메일 확인 중 오류가 발생했습니다.",
          });
        }
      }, 1000); // 1초 후 자동 확인

      return () => clearTimeout(timer);
    } else {
      setEmailCheck({ status: "", message: "" });
    }
  }, [form.email]);

  // 아이디 자동 중복확인 (임시) 아이디는 형식이나 길이 체크 필요 없을 듯 중복확인만
  useEffect(() => {
    if (form.user_id) {
      const timer = setTimeout(() => {
        try {
          // 임시로 길이만 체크 (4자 이상)
          if (form.user_id.length >= 4) {
            setIdCheck({
              status: "success",
              message: "사용 가능한 아이디입니다.",
            });
          } else {
            setIdCheck({
              status: "error",
              message: "아이디는 4자 이상이어야 합니다.",
            });
          }
        } catch (err) {
          setIdCheck({
            status: "error",
            message: "아이디 확인 중 오류가 발생했습니다.",
          });
        }
      }, 1000); // 1초 후 자동 확인

      return () => clearTimeout(timer);
    } else {
      setIdCheck({ status: "", message: "" });
    }
  }, [form.user_id]);

  // 비밀번호 길이 검증
  useEffect(() => {
    if (form.password && form.password.length > 0) {
      const timer = setTimeout(() => {
        if (form.password.length < 8) {
          setPasswordLengthCheck({
            status: "error",
            message: "비밀번호는 8자 이상이어야 합니다.",
          });
        } else {
          setPasswordLengthCheck({
            status: "success",
            message: "사용 가능한 비밀번호입니다.",
          });
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setPasswordLengthCheck({ status: "", message: "" });
    }
  }, [form.password]);

  // 비밀번호 재확인 검증 (API 없이 클라이언트에서 처리) 디바운싱 말고 실시간 확인으로 바꾸는게 좋을까
  useEffect(() => {
    if (form.passwordConfirm) {
      const timer = setTimeout(() => {
        try {
          if (form.password === form.passwordConfirm) {
            setPasswordCheck({
              status: "success",
              message: "비밀번호가 일치합니다.",
            });
          } else {
            setPasswordCheck({
              status: "error",
              message: "비밀번호가 일치하지 않습니다.",
            });
          }
        } catch (err) {
          setPasswordCheck({
            status: "error",
            message: "비밀번호 확인 중 오류가 발생했습니다.",
          });
        }
      }, 1000); // 1초 후 확인

      return () => clearTimeout(timer);
    } else {
      setPasswordCheck({ status: "", message: "" });
    }
  }, [form.password, form.passwordConfirm]);

  // 모든 검증이 성공했는지 확인하는 계산된 값
  const isFormValid =
    emailCheck.status === "success" &&
    idCheck.status === "success" &&
    passwordLengthCheck.status === "success" &&
    passwordCheck.status === "success" &&
    form.name.trim() !== "";

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    // 버튼이 비활성화 상태면 실행하지 않음
    if (!isFormValid) {
      return;
    }

    try {
      // passwordConfirm 제거하고 백엔드에 전송
      const { passwordConfirm, ...signupData } = form;

      await axios.post("http://127.0.0.1:8000/api/auth/signup/", signupData, {
        headers: { "Content-Type": "application/json" },
      });
      setShowModal(true);
    } catch (err) {
      setMessage("회원가입 실패: 입력값을 확인하세요.");
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate("/onboarding");
  }; //모달에서 회원가입 완료 버튼 누르면 온보딩 페이지로 이동

  return (
    <div className="mobile-wrapper">
      <div className="signup-container">
        <div className="signup-title">회원가입</div>
        <div className="signup-box">
          <div className="signup-row">
            <div className="signup-field-name">
              <span className="field-label-name">이름ㅣ</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="signup-row">
            <div className="signup-field-email">
              <span className="field-label-email">이메일ㅣ</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {emailCheck.message && (
                <div className={`check-message ${emailCheck.status}`}>
                  {emailCheck.message}
                </div>
              )}
            </div>
          </div>

          <div className="signup-row">
            <div className="signup-field-id">
              <span className="field-label-id">아이디ㅣ</span>
              <input
                type="text"
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
              />
              {idCheck.message && (
                <div className={`check-message ${idCheck.status}`}>
                  {idCheck.message}
                </div>
              )}
            </div>
          </div>

          <div className="signup-row">
            <div className="signup-field-pw">
              <span className="field-label-pw">비밀번호ㅣ</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              {passwordLengthCheck.message && (
                <div className={`check-message ${passwordLengthCheck.status}`}>
                  {passwordLengthCheck.message}
                </div>
              )}
            </div>
          </div>

          <div className="signup-row">
            <div className="signup-field-repw">
              <span className="field-label-repw">비밀번호 재확인ㅣ</span>
              <input
                type="password"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
              />
              {passwordCheck.message && (
                <div className={`check-message ${passwordCheck.status}`}>
                  {passwordCheck.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        className={`signup-submit-btn ${isFormValid ? "active" : ""}`}
        onClick={handleSignup}
        disabled={!isFormValid}
      >
        회원가입
      </button>

      {message && (
        <div
          className="signup-message"
          style={{ color: message.includes("성공") ? "green" : "red" }}
        >
          {message}
        </div>
      )}

      {/* 회원가입 완료 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <img src={letterlogo}></img>
            <div className="modal-content">
              <h3>회원가입 완료</h3>
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

export default Signup;
