import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../../styles/ReceivedList.css";
import arrow from "../../assets/images/arrow.png";
import arrowstart from "../../assets/images/arrow-start.png";
import axiosInstance from "../../apis/axios";

const colorClass = {
  green: "sent-item-green",
  gray: "sent-item-gray",
  yellow: "sent-item-yellow",
  blue: "sent-item-blue",
  pink: "sent-item-pink",
};

const ITEMS_PER_PAGE = 5;
const MAX_PAGE_BUTTONS = 5;

const ReceivedList = () => {
  const [letters, setLetters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  // 백엔드에서 전체 리스트 불러오기
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    axiosInstance.get(`/api/mypage/received/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      setLetters(res.data || []);
      setTotalCount((res.data || []).length);
    })
    .catch(err => console.error('받은 편지 불러오기 실패', err));
  }, []);

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
    <div className="receivedlist-wrapper">
      <h2 className="receivedlist-title">내 보관소 - 받은 편지함</h2>

      <div className="receivedlist-list">
        {currentLetters.length === 0 ? (
          <p className="no-letters">받은 편지가 없습니다.</p>
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
              <div key={item.id} className={`received-item ${colorClass[item.paper_color] || "sent-item-gray"}`}>
                <span className="received-title">
                  [ {item.type === "sky"
                      ? (
                          item.reply_text && item.reply_text.trim() !== ""
                            ? item.reply_text.replace(/^"(.*)"$/, '$1').slice(0, 15)
                            : "AI 답장 없음"
                        )
                      : (
                          item.title && item.title.trim() !== ""
                            ? item.title.slice(0, 15)
                            : "제목 없음"
                        )
                    } ]
                </span>
                <span className="received-user">
                  {recipientValue}
                </span>
                <button
                  className="received-detail"
                  onClick={() =>
                    navigate(
                      item.type === "sky"
                        ? `/mypage/detail/received/sky/${item.id}`
                        : `/mypage/detail/received/${item.id}`
                    )
                  }
                >
                  <img src={arrow} className="arrow" alt="arrow" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="receivedlist-pagination">
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

export default ReceivedList;