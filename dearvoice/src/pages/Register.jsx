import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css';

const steps = [
  { name: "user_id", label: "아이디ㅣ", placeholder: "영문 아이디 입력", type: "text" },
  { name: "email", label: "이메일ㅣ", placeholder: "이메일 입력", type: "email" },
  { name: "password", label: "비밀번호ㅣ", placeholder: "비밀번호 입력", type: "password" },
  { name: "nickname", label: "닉네임ㅣ", placeholder: "닉네임 입력", type: "text" },
];

const Register = () => {
  const [form, setForm] = useState({
    user_id: "",
    email: "",
    password: "",
    nickname: ""
  });
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [steps[step].name]: e.target.value });
  };

  const handleNext = e => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post("http://127.0.0.1:8000/api/signup/", form, {
        headers: { "Content-Type": "application/json" }
      });
      setTimeout(() => {
        navigate("/onboarding");
      }, 100);
    } catch (err) {
      setMessage("회원가입 실패: 입력값을 확인하세요.");
    }
  };

  return (
    <div className='mobile-wrapper'>
      <div className="register-wrapper">
        <h2>
          {step === 0 && "나만의 아이디를 설정해주세요!"}
          {step === 1 && "이메일을 입력해주세요!"}
          {step === 2 && "비밀번호를 입력해주세요!"}
          {step === 3 && "닉네임을 입력해주세요!"}
        </h2>
        <form onSubmit={step < steps.length - 1 ? handleNext : handleSignup}>
          <label style={{ fontWeight: 600 }}>{steps[step].label}</label>
          <input
            name={steps[step].name}
            type={steps[step].type}
            value={form[steps[step].name]}
            onChange={handleChange}
            placeholder={steps[step].placeholder}
            required
            className='input'
          />
          <button className="next" type="submit">
            {step < steps.length - 1 ? "다음" : "시작하기"}
          </button>
          {message && (
            <div style={{ color: message.includes("성공") ? "green" : "red", marginTop: 8 }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;