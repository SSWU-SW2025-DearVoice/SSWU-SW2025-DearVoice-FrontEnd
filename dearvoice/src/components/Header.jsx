import '../styles/Header.css';
import React, { useState } from "react";
import Navbar from "./Navbar";
import navbarIcon from "../assets/images/burgerbar.png";
import logoIcon from "../assets/images/logotext.png";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        console.log("Logout");
        localStorage.clear();
        window.location.href = '/';
    } // 로그아웃 함수 추가 해야 됨

    const handleHome = () => {
        window.location.href = '/home';
    } // 로고 이미지 누르면 home으로 돌아감

  return (
    <>
    <div className="header-wrapper">
      <div className="header-container">
        <img src={logoIcon}  onClick={handleHome} alt="logo" className="logotext" />
        <button className="navbar-button"
        onClick={() => setIsOpen(prev => !prev)}>
        <img src={navbarIcon} alt="menu" className="burgerbar" />
        </button>

      {isOpen && <Navbar onLogout={handleLogout} onClose={() => setIsOpen(false)} />}
      </div>
    </div>
    </>
  );
};
//isOpen이 true인 경우에만 냅바 컴포넌트 랜더링, props 두 개 전달 -> onLogout, onClose

export default Header;
