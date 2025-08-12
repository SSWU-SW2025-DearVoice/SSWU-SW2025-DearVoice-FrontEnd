import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../apis/axios"
import "../styles/Signup.css";
import letterlogo from "../assets/images/letter-before.png";

const Signup = () => {
  const [form, setForm] = useState({
    nickname: "",
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
    if (e.target.name === "email") setEmailCheck({ status: "", message: "" });
    if (e.target.name === "user_id") setIdCheck({ status: "", message: "" });
  };

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
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setPasswordCheck({ status: "", message: "" });
    }
  }, [form.password, form.passwordConfirm]);

  const checkUserIdDuplicate = async () => {
    if (!form.user_id) {
      setIdCheck({ status: "error", message: "아이디를 입력하세요." });
      return;
    }
    try {
      const res = await axiosInstance.get(
        "/api/auth/check/user-id/",
        { params: { user_id: form.user_id } }
      );
      if (res.data.available) {
        setIdCheck({ status: "success", message: "사용 가능한 아이디입니다." });
      } else {
        setIdCheck({
          status: "error",
          message: "이미 사용 중인 아이디입니다.",
        });
      }
    } catch (err) {
      setIdCheck({
        status: "error",
        message: "아이디 확인 중 오류가 발생했습니다.",
      });
    }
  };

  const checkEmailDuplicate = async () => {
    if (!form.email) {
      setEmailCheck({ status: "error", message: "이메일을 입력하세요." });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setEmailCheck({
        status: "error",
        message: "올바른 이메일 형식이 아닙니다.",
      });
      return;
    }
    try {
      const res = await axiosInstance.get(
        "/api/auth/check/email/",
        { params: { email: form.email } }
      );
      if (res.data.available) {
        setEmailCheck({
          status: "success",
          message: "사용 가능한 이메일입니다.",
        });
      } else {
        setEmailCheck({
          status: "error",
          message: "이미 사용 중인 이메일입니다.",
        });
      }
    } catch (err) {
      setEmailCheck({
        status: "error",
        message: "이메일 확인 중 오류가 발생했습니다.",
      });
    }
  };

  // 모든 검증이 성공했는지
  const isFormValid =
    emailCheck.status === "success" &&
    idCheck.status === "success" &&
    passwordLengthCheck.status === "success" &&
    passwordCheck.status === "success" &&
    form.nickname.trim() !== "";

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isFormValid) {
      return;
    }

    try {
      const { passwordConfirm, ...signupData } = form;

      await axiosInstance.post("/api/auth/signup/", signupData, {
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
                name="nickname"
                value={form.nickname}
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
              <button
                type="button"
                onClick={checkEmailDuplicate}
                className="check-btn"
              >
                중복 확인
              </button>
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
              <button
                type="button"
                onClick={checkUserIdDuplicate}
                className="check-btn"
              >
                중복 확인
              </button>
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

        <button
        className={`signup-submit-btn ${isFormValid ? "active" : ""}`}
        onClick={handleSignup}
        disabled={!isFormValid}
      >
        회원가입
      </button>
      </div>

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
