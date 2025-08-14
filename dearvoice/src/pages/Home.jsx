import React, { useEffect, useState } from "react";
import axiosInstance from "../apis/axiosInstance";
import "../styles/Home.css";
import homeletter from "../assets/images/homeletter.png";

const Home = () => {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/api/auth/me/");
        setUserId(response.data.nickname || response.data.user_id);
      } catch (error) {
        console.error("유저 정보 불러오기 실패:", error);
        setUserId("사용자");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <div className="homeletter-wrapper">
      <div className="homeletter">
        <img src={homeletter} alt="home" />
        <div className="welcome-text">
          {isLoading ? (
            <>
              <div className="skeleton-home"></div>
            </>
          ) : (
            <>
              '{userId}'님을 <br /> 환영합니다💛
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
