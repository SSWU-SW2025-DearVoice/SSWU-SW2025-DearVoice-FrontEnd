import '../styles/Header.css';
import { useState } from "react";
import Navbar from "./Navbar";
import navbarIcon from "../assets/icons/burgerbar.svg";
import logoIcon from "../assets/icons/logotext.svg";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        console.log("Logout");
        localStorage.clear();
        window.location.href = '/';
    }

    const handleHome = () => {
        window.location.href = '/home';
    }

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

export default Header;
