import '../styles/Layout.css';
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Navbar from "./Navbar";

function Layout() {
  const location = useLocation();
  const path = location.pathname;

  // 헤더/냅바 안 나올 경로
  const excludePaths = ["/", "/onboarding", "/register"];
  const showLayout = !excludePaths.includes(path);

  return (
    <div className="mobile-wrapper">
    <div className="layout-wrapper">
      {showLayout && <Header />}
      <main className="content">
        <Outlet />
      </main>
    </div>
    </div>
  );
}

export default Layout;
