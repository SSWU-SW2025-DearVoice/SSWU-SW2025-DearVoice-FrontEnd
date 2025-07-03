import React, { useEffect, useState } from 'react';
import '../styles/IntroPage.css';
import letterbefore from '../assets/images/letter-before.png';
import letterafter from '../assets/images/letter-after.png';
import googlelogo from '../assets/images/google.png';
import kakaologo from '../assets/images/kakao.png';

function Intro() {
  const [showBefore, setShowBefore] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowBefore(prev => !prev);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

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

        <div className="login-buttons">
          <button className="google-btn">
            <img src={googlelogo} alt="google" className="googlelogo" />
            <div className="btn-text">구글 계정으로 시작</div>
          </button>
          <button className="kakao-btn">
            <img src={kakaologo} alt="kakao" className="kakaologo" />
            <div className="btn-text">카카오 계정으로 시작</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Intro;

