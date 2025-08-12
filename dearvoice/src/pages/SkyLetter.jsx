import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LetterDetailCard.css";
import "../styles/SkyLetter.css";

const SkyLetter = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [category, setCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("gray");

  const navigate = useNavigate();

  const handleNext = () => {
    const data = {
      name,
      gender,
      age,
      category,
      selectedColor,
    };

    navigate("/sky02", { state: data });
  };

  const isFormComplete = name && gender && age && category;

  return (
    <>
      <div className="mypage-title">
        <h2 className="mypage-top">하늘 편지</h2>
      </div>

      <div className={`letterdetail-box ${selectedColor}`}>
        <p className="letterdetail-description">
          수신인에 대한 정보를 알려주세요!
        </p>

        <div className="letterdetail-row">
          <span className="letterdetail-label">이름ㅣ</span>
          <input
            type="text"
            placeholder="ex. 연탄이"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="letterdetail-row">
          <span className="letterdetail-label">성별ㅣ</span>
          <div className="gender-options">
            <label>
              <input
                type="radio"
                name="gender"
                value="남성"
                onChange={() => setGender("남성")}
              />{" "}
              남성
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="여성"
                onChange={() => setGender("여성")}
              />{" "}
              여성
            </label>
          </div>
        </div>

        <div className="letterdetail-row">
          <span className="letterdetail-label">나이ㅣ</span>
          <input
            type="text"
            placeholder="ex. 16"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="letterdetail-row">
          <span className="letterdetail-label">분류ㅣ</span>
          <input
            type="text"
            placeholder="강아지"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </div>

      <div className="bottomButton">
        <button
          className={`sendButton ${isFormComplete ? "active" : ""}`}
          disabled={!isFormComplete}
          onClick={handleNext}
        >
          다음으로
        </button>
      </div>
    </>
  );
};

export default SkyLetter;
