import '../../styles/MypageHome.css'
import sentimg from "../../assets/images/letter-after.png";
import receivedimg from "../../assets/images/letter-before.png";
import { useNavigate } from "react-router-dom";

const MypageHome = () => {
  const navigate = useNavigate();

  return (
    <div className="mypage-title">
      <h2 className="mypage-top">내 보관소</h2>
      <div className="mypage-container">
        <button
          className="mypage-sent"
          onClick={() => navigate("/mypage/sent")}
        >
          <img src={sentimg} className='sentimg' alt="보낸 편지함"/>
          <div className="sent-text">보낸 편지함</div>
        </button>
        <button className="mypage-received"
        onClick={() => navigate("/mypage/received")} >
          <img src={receivedimg} className='receivedimg' alt="받은 편지함"/>
          <div className="received-text">받은 편지함</div>
        </button>
      </div>
    </div>
  )
}

export default MypageHome;