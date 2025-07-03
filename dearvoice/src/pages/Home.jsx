import React, { useState } from 'react'
import "../styles/Home.css"
import homeletter from '../assets/images/homeletter.png'

const Home = () => {
  const [nickname] = useState("jeongbami"); // 임시 닉네임, api 연동 할 때 setNickname

  return (
    <div className="homeletter-wrapper">
      <div className="homeletter">
        <img src={homeletter} alt="home" />
        <div className="welcome-text">'{nickname}'님을 <br></br> 환영합니다💛</div>
      </div>
    </div>
  )
}

export default Home