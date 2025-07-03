import React from 'react'
import "../styles/Home.css"
import homeletter from '../assets/images/homeletter.png'

const Home = () => {
  return (
    <div>
        <img src={homeletter} className="homeletter" alt="home" />
    </div>
  )
}

export default Home