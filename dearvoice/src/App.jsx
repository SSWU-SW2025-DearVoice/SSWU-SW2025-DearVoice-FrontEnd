import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";

// 비로그인 페이지(Intro)
import Intro from "./pages/IntroPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/onboarding";
import Register from "./pages/Register";

// 로그인 후 페이지
import Home from "./pages/Home";
import VoiceLetterPage from "./pages/VoiceLetter";
import SkyLetterPage from "./pages/SkyLetter";

// 마이페이지
import MyPageHome from "./pages/mypage/MypageHome";
import SentList from "./pages/mypage/SentList";
import ReceivedList from "./pages/mypage/ReceivedList";
import SentLetterDetail from "./pages/mypage/SentLetterDetail";
import ReceivedLetterDetail from "./pages/mypage/ReceivedLetterDetail";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* 비로그인 페이지 */}
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/register" element={<Register />} />

        {/* 로그인 후 페이지 (헤더/냅바 포함) */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/voice" element={<VoiceLetterPage />} />
          <Route path="/sky" element={<SkyLetterPage />} />

          {/* 마이페이지 라우트 */}
          <Route path="/mypage">
            <Route index element={<MyPageHome />} />
            <Route path="sent" element={<SentList />} />
            <Route path="received" element={<ReceivedList />} />
            <Route path="detail/sent/:id" element={<SentLetterDetail />} />
            <Route
              path="detail/received/:id"
              element={<ReceivedLetterDetail />}
            />
          </Route>
        </Route>

        {/* NotFound 페이지 (가장 마지막에 추가) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// 로그인 안 하면 다른 페이지 접근 불가, 바로 Intro페이지로 리다이렉트 추가하기

export default App;
