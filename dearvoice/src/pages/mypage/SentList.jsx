import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/SentList.css';
import axiosInstance from "../../apis/axios";
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

  // 백엔드에서 전체 리스트 불러오기
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    axiosInstance.get(`/api/mypage/sent/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      setLetters(res.data || []);
      setTotalCount((res.data || []).length);
    })
    .catch(err => console.error('보낸 편지 불러오기 실패', err));
  }, []);

  /* 편지 삭제 */
  const handleDelete = async (letterId, letterType) => {
    const confirmed = window.confirm("정말 이 편지를 삭제하시겠습니까?");
    if (!confirmed) return;

    const token = localStorage.getItem("accessToken");
    try {
      await axiosInstance.delete(`/api/mypage/sent/delete/${letterType}/${letterId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("삭제가 완료되었습니다.");
      const updated = letters.filter(item => item.id !== letterId);
      setLetters(updated);
      setTotalCount(updated.length);

      const lastPage = Math.ceil(updated.length / ITEMS_PER_PAGE);
      if (page > lastPage) {
        setPage(lastPage);
      }

    } catch (err) {
      console.error("편지 삭제 실패", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const safeLetters = Array.isArray(letters) ? letters : [];

  // slice로 페이지 분할
  const currentLetters = safeLetters.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(safeLetters.length / ITEMS_PER_PAGE);
  const currentGroup = Math.ceil(page / MAX_PAGE_BUTTONS);
  const groupStart = (currentGroup - 1) * MAX_PAGE_BUTTONS + 1;
  const groupEnd = Math.min(groupStart + MAX_PAGE_BUTTONS - 1, totalPages);

  return (
    <div className="sentlist-wrapper">
      <h2 className="sentlist-title">내 보관소 - 보낸 편지함</h2>

      <div className="sentlist-list">
        {currentLetters.length === 0 ? (
          <p className="no-letters">보낸 편지가 없습니다.</p>
        ) : (
          currentLetters.map(item => {
            let recipientValue = "정보 없음";
            if (item.type === "sky") {
              recipientValue = item.receiver_name || "정보 없음";
            } else {
              recipientValue =
                item.recipients?.map(r => r.display_id || r.email).join(", ") || "정보 없음";
            }

            return (
              <div key={item.id} className={`sent-item ${colorClass[item.paper_color] || "sent-item-gray"}`}>
                <span className="sent-title">[ {item.title?.slice(0, 15)} ]</span>
                <span className="sent-user">
                  {recipientValue}
                </span>

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
            );
          })
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