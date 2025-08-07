import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../../styles/ReceivedList.css";
import arrow from "../../assets/images/arrow.png";
import arrowstart from "../../assets/images/arrow-start.png";
import axiosInstance from "../../apis/axios";
import { FaSearch } from "react-icons/fa";

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
  const [search, setSearch] = useState(""); // 검색어 상태
  const [searchInput, setSearchInput] = useState(""); // 입력창 상태

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

    // recipientValue 기준으로 검색
  const safeLetters = Array.isArray(letters) ? letters : [];
  const filteredLetters = safeLetters.filter(item => {
    if (!search.trim()) return true;
    let recipientValue = "";
    if (item.type === "sky") {
      recipientValue = item.receiver_name || "";
    } else {
      recipientValue = item.recipients?.map(r => r.display_id || r.email).join(", ") || "";
    }
    return recipientValue.includes(search.trim());
  });

  // slice로 페이지 분할
  const currentLetters = filteredLetters.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const totalPages = Math.ceil(filteredLetters.length / ITEMS_PER_PAGE);
  const currentGroup = Math.ceil(page / MAX_PAGE_BUTTONS);
  const groupStart = (currentGroup - 1) * MAX_PAGE_BUTTONS + 1;
  const groupEnd = Math.min(groupStart + MAX_PAGE_BUTTONS - 1, totalPages);

  return (
    <div className="receivedlist-wrapper">
      <h2 className="receivedlist-title">내 보관소 - 받은 편지함</h2>
      <div className="sentlist-searchbar-wrapper">
        <div className="sentlist-searchbar-inner">
          <input
            type="text"
            placeholder="수신인 검색"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="sentlist-search-input"
          />
          <FaSearch
            className="sentlist-search-icon"
            onClick={handleSearch}
          />
        </div>
      </div>
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