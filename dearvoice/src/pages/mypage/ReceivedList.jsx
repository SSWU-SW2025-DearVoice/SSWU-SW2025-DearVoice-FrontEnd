import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ReceivedList.css";
import arrow from "../../assets/images/arrow.png";
import arrowstart from "../../assets/images/arrow-start.png";
import useLetters from "../../hooks/useLetters"; // 추가

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
  const { letters, loading } = useLetters(); // API에서 편지 목록 가져오기
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  if (loading) return <div>로딩 중...</div>;
  if (!letters || letters.length === 0) return <div>받은 편지가 없습니다.</div>;

  const totalPages = Math.ceil(letters.length / ITEMS_PER_PAGE);

  const currentGroup = Math.ceil(page / MAX_PAGE_BUTTONS);
  const groupStart = (currentGroup - 1) * MAX_PAGE_BUTTONS + 1;
  const groupEnd = Math.min(groupStart + MAX_PAGE_BUTTONS - 1, totalPages);

  // 최신순 정렬 + 페이지 처리 (여기서 letters 배열이 API 응답 데이터여야 함)
  const sortedLetters = [...letters].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const pageData = sortedLetters.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="receivedlist-wrapper">
      <h2 className="receivedlist-title">내 보관소 - 받은 편지함</h2>
      <div className="receivedlist-list">
        {pageData.map((item, index) => (
          <div
            key={`${item.id}-${(page - 1) * ITEMS_PER_PAGE + index}`}
            className={`received-item ${
              colorClass[item.paper_color || "gray"]
            }`}
          >
            <span className="received-title">
              [ {item.transcript || "제목 없음"} ]
            </span>
            <span className="received-user">
              {item.sender?.username ||
                (typeof item.sender === "string" ? item.sender : "알 수 없음")}
            </span>

            <button
              className="received-detail"
              onClick={() => navigate(`/mypage/detail/received/${item.id}`)}
            >
              <img src={arrow} className="arrow" alt="arrow" />
            </button>
          </div>
        ))}
      </div>
      <div className="receivedlist-pagination">
        <button
          className="pagination-arrow"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <img src={arrowstart} className="arrow-start" alt="prev" />
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
          className="pagination-arrow"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          <img src={arrow} className="arrow-end" alt="next" />
        </button>
      </div>
    </div>
  );
};

export default ReceivedList;
