import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/IntroPage.css';
import letterbefore from '../assets/images/letter-before.png';
import letterafter from '../assets/images/letter-after.png';
import loginlogo from '../assets/images/loginlogo.png';
import signuplogo from '../assets/images/signuplogo.png';
import googlelogo from '../assets/images/google.png';
import axiosInstance from "../apis/axios";

function Intro() {
  const [showBefore, setShowBefore] = useState(true);
  const [googleReady, setGoogleReady] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
    const interval = setInterval(() => {
      setShowBefore(prev => !prev);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        if (!window.google.__gsi_initialized) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: async (response) => {
              const id_token = response.credential;
              if (!id_token) {
                alert("구글 로그인 토큰 수신 실패");
                return;
              }
              try {
                const res = await axiosInstance.post("/api/auth/login/google/", { id_token });
                localStorage.setItem("accessToken", res.data.access);
                localStorage.setItem("refreshToken", res.data.refresh);
                navigate("/home");
              } catch (err) {
                alert("구글 로그인에 실패했습니다.");
              }
            },
          });
          window.google.__gsi_initialized = true;
        }
        setGoogleReady(true);
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoogleLogin = useCallback(() => {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      alert("구글 로그인 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    window.google.accounts.id.prompt();
  }, []);
  console.log("GOOGLE CLIENT ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  console.log("현재 Origin:", window.location.origin);

  return (
    <div className="mobile-wrapper">
      <div className="intro-container">
        <div className="letter-logo">
          <img
            src={letterbefore}
            alt="메일 전"
            className={`letter-img letter-before ${showBefore ? 'show' : 'hide'}`}
          />
          <img
            src={letterafter}
            alt="메일 후"
            className={`letter-img letter-after ${showBefore ? 'hide' : 'show'}`}
          />
        </div>
        <h1 className="intro-title">Dear Voice</h1>
        <p className="intro-subtitle">: 글자가 닿지 못하는 곳에, 당신의 목소리가 닿습니다.</p>

        <div className="register-buttons">
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            <img src={loginlogo} alt="login" className="intro-login-btn" />
            <div className="btn-text">로그인</div>
          </button>

          <button className="signup-btn"
            onClick={() => navigate("/signup")}>
            <img src={signuplogo} alt="signup" className="intro-signup-btn" />
            <div className="btn-text">회원가입</div>
          </button>

          <button
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={!googleReady}
          >
            <img src={googlelogo} alt="google-login" className="intro-google-btn" />
            <div className="btn-text">구글로 시작하기</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Intro;

