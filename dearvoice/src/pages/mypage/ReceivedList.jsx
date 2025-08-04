import React, { useState, useEffect, useMemo } from 'react';
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
  const [allLetters, setAllLetters] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();

  // 전체 모드: 서버 페이지네이션
  useEffect(() => {
    if (filterType === "all") {
      const accessToken = localStorage.getItem("accessToken");
      axiosInstance.get(`/api/mypage/received/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(res => {
        setLetters(res.data.results || []);
        setTotalCount(res.data.count || 0);
      })
      .catch(err => console.error('받은 편지 불러오기 실패', err));
    }
  }, [page]);

  const safeLetters = Array.isArray(letters) ? letters : [];

  // 카테고리 필터링
  const filteredLetters = safeLetters.filter(item => {
    if (filterType === "all") return true;
    if (filterType === "sky") return item.type === "sky";
    if (filterType === "voice") return item.type !== "sky";
    return true;
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const currentGroup = Math.ceil(page / MAX_PAGE_BUTTONS);
  const groupStart = (currentGroup - 1) * MAX_PAGE_BUTTONS + 1;
  const groupEnd = Math.min(groupStart + MAX_PAGE_BUTTONS - 1, totalPages);

  return (
    <div className="receivedlist-wrapper">
      <h2 className="receivedlist-title">내 보관소 - 받은 편지함</h2>
      <div>
        <button
          className={`received-filter-btn${filterType === "all" ? " active" : ""}`}
          onClick={() => setFilterType("all")}
        >전체</button>
        <button
          className={`received-filter-btn${filterType === "voice" ? " active" : ""}`}
          onClick={() => setFilterType("voice")}
        >음성편지</button>
        <button
          className={`received-filter-btn${filterType === "sky" ? " active" : ""}`}
          onClick={() => setFilterType("sky")}
        >하늘편지</button>
      </div>
      <div className="receivedlist-list">
        {filteredLetters.length === 0 ? (
          <p className="no-letters">받은 편지가 없습니다.</p>
        ) : (
          filteredLetters.map(item => {
            // 수신자 표시 로직
            let recipientValue = "정보 없음";
            if (item.type === "sky") {
              recipientValue = item.receiver_name || "정보 없음";
            } else {
              // 여러 명일 경우 이메일/아이디를 ,로 연결
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