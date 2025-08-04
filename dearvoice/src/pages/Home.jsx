import React, { useEffect, useState } from "react";
import axiosInstance from "../apis/axios";
import "../styles/Home.css";
import homeletter from "../assets/images/homeletter.png";

const Home = () => {
  const [userId, setUserId] = useState("loading...");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("accessToken 없음");
          return;
        }

        const response = await axiosInstance.get("/api/auth/me/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // console.log("/users/me/ 응답:", response.data);
        setUserId(response.data.user_id); // ✅ nickname → user_id
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="homeletter-wrapper">
      <div className="homeletter">
        <img src={homeletter} alt="home" />
        <div className="welcome-text">
          '{userId}'님을 <br /> 환영합니다💛
        </div>
      </div>
    </div>
  );
};

export default Home;
