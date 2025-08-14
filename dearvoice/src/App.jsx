import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";

import Intro from "./pages/IntroPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FindPassword from "./pages/FindPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/onboarding";

import Home from "./pages/Home";
import VoiceLetterPage from "./pages/VoiceLetter";
import SkyLetterPage from "./pages/SkyLetter";
import SkyLetterPage02 from "./pages/SkyLetter02";

import MyPageHome from "./pages/mypage/MypageHome";
import SentList from "./pages/mypage/SentList";
import ReceivedList from "./pages/mypage/ReceivedList";
import SentLetterDetail from "./pages/mypage/SentLetterDetail";
import ReceivedLetterDetail from "./pages/mypage/ReceivedLetterDetail";
import NotFound from "./pages/NotFound";
import PublicLetterDetail from "./pages/PublicLetterDetail"; 
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-password" element={<FindPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route element={<Layout />}>
          <Route path="/share/:uuid" element={<PublicLetterDetail />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/voice" element={<VoiceLetterPage />} />
            <Route path="/sky" element={<SkyLetterPage />} />
            <Route path="/sky02" element={<SkyLetterPage02 />} />

            <Route path="/mypage">
              <Route index element={<MyPageHome />} />
              <Route path="sent" element={<SentList />} />
              <Route path="received" element={<ReceivedList />} />
              <Route path="detail/sent/:id" element={<SentLetterDetail />} />
              <Route path="detail/received/:id" element={<ReceivedLetterDetail />} />
              <Route path="detail/received/sky/:id" element={<ReceivedLetterDetail />} />
              <Route path="detail/sent/sky/:id" element={<SentLetterDetail />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
