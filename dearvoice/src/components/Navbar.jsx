import '../styles/Navbar.css';
import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = ({ onClose }) => {
  const navigate = useNavigate();

  const handleMove = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // 토큰 제거
    navigate("/");
    if (onClose) onClose();
  };

  return (
    <ul className="nablist">
      <li onClick={handleLogout} className="logout">로그아웃</li>
      <hr className="nablist-container" />
      <li className="nablist-first" onClick={() => handleMove("/voice")}>음성 편지</li>
      <li className="nablist-sec" onClick={() => handleMove("/sky")}>하늘 편지</li>
      <li className="nablist-third" onClick={() => handleMove("/mypage")}>내 보관소</li>
    </ul>
  );
};

export default NavBar;

