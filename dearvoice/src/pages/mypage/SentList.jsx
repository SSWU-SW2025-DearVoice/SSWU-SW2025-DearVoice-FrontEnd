import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/SentList.css';
import axios from 'axios';
import arrow from '../../assets/images/arrow.png';
import arrowstart from '../../assets/images/arrow-start.png';

const colorClass = {
  green: "sent-item-green",
  gray: "sent-item-gray",
  yellow: "sent-item-yellow",
  blue: "sent-item-blue",
  pink: "sent-item-pink",
};

const ITEMS_PER_PAGE = 5;
const MAX_PAGE_BUTTONS = 5;

const SentList = () => {
  const [letters, setLetters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    axios.get(`http://localhost:8000/api/mypage/sent/?page=${page}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      setLetters(res.data.results || []);
      setTotalCount(res.data.count || 0);
    })
    .catch(err => console.error('보낸 편지 불러오기 실패', err));
  }, [page]);
  
  /* 편지 삭제 */
  const handleDelete = async (letterId, letterType) => {
    const confirmed = window.confirm("정말 이 편지를 삭제하시겠습니까?");
    if (!confirmed) return;

    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`http://localhost:8000/api/mypage/sent/delete/${letterType}/${letterId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("삭제가 완료되었습니다.");
      setLetters(prev => prev.filter(item => item.id !== letterId));
    } catch (err) {
      console.error("편지 삭제 실패", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const safeLetters = Array.isArray(letters) ? letters : [];
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const currentGroup = Math.ceil(page / MAX_PAGE_BUTTONS);
  const groupStart = (currentGroup - 1) * MAX_PAGE_BUTTONS + 1;
  const groupEnd = Math.min(groupStart + MAX_PAGE_BUTTONS - 1, totalPages);

  return (
    <div className="sentlist-wrapper">
      <h2 className="sentlist-title">내 보관소 - 보낸 편지함</h2>
      <div className="sentlist-list">
        {safeLetters.length === 0 ? (
          <p className="no-letters">보낸 편지가 없습니다.</p>
        ) : (
          safeLetters.map(item => (
            <div key={item.id} className={`sent-item ${colorClass[item.paper_color] || "sent-item-gray"}`}>
              <span className="sent-title">[ {item.title?.slice(0, 15)} ]</span>
              <span className="sent-user">
                {item.type === "sky"
                  ? "하늘편지"
                  : `일반편지 → @${item.recipients?.[0]?.display_id || item.recipients?.[0]?.email || "수신자 없음"}`}
              </span>
              
              {/* 편지 삭제 */}
              <div className="sent-actions">
                <button
                  className="sent-detail"
                  onClick={() =>
                    navigate(
                      item.type === "sky"
                        ? `/mypage/detail/sent/sky/${item.id}`
                        : `/mypage/detail/sent/${item.id}`
                    )
                  }
                >
                  <img src={arrow} className='arrow' alt="arrow" />
                </button>

                <button
                  className="sent-delete"
                  onClick={() => handleDelete(item.id, item.type)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="sentlist-pagination">
        <button
          className='pagination-arrow'
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <img src={arrowstart} className='arrow-start' alt="prev" />
        </button>

        {Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => {
          const pageNum = groupStart + i;
          return (
            <button
              key={pageNum}
              className={`pagination-num ${page === pageNum ? "active" : ""}`}
              onClick={() => setPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          className='pagination-arrow'
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          <img src={arrow} className='arrow-end' alt="next" />
        </button>
      </div>
    </div>
  );
};

export default SentList;