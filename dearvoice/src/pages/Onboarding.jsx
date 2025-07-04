import React, { useState } from "react";
import "../styles/Onboarding.css";
import slide1 from "../assets/images/letter-before.png";
import slide2 from "../assets/images/letter-heart.png";
import slide3 from "../assets/images/letter-after.png";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; //라이브러리 설치 필요!


const slides = [
  {
    text: "베리어프리한 소통 환경을 통해\n누구나 감정을 전달할 수 있어요.",
    img: slide1,
  },
  {
    text: "음성으로 전하는 따스한 편지,\n목소리로 사랑과 마음을 전해보세요.",
    img: slide2,
  },
  {
    text: "누구나 함께 연결되는 세상.\n지금, Dear Voice와 시작해보아요!",
    img: slide3,
  },
];



function Onboarding() {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (idx < slides.length - 1) setIdx(idx + 1);
    else navigate("/home");
  };

  

  return (
    <div className="mobile-wrapper">
      <div className="onboarding-container">
       <AnimatePresence mode="wait">
          {/* 텍스트 애니메이션 */}
          <motion.div
            key={"text-" + idx}
            className="onboarding-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            {slides[idx].text.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </motion.div>

          {/* 이미지 애니메이션 */}
          <motion.img
            key={"img-" + idx}
            src={slides[idx].img}
            alt="mail"
            className={`onboarding-img slide-img-${idx + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        <div className="onboarding-dots">
          {slides.map((_, i) => (
            <span
              key={i}
              className={i === idx ? "dot active" : "dot"}
            ></span>
          ))}
        </div>
        <button className="onboarding-btn" onClick={next}>
          {idx === slides.length - 1 ? "시작하기" : "다음으로"}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;