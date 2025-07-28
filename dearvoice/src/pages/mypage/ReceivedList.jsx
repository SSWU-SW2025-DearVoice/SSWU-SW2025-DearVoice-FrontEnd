import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ReceivedList.css';
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

const ReceivedList = () => {
  const [letters, setLetters] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    axios.get('http://localhost:8000/api/mypage/received/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => {
      setLetters(res.data.results || res.data);
    })
    .catch(err => console.error('받은 편지 불러오기 실패', err));
  }, []);

  const safeLetters = Array.isArray(letters) ? letters : [];
  const totalPages = Math.ceil(safeLetters.length / ITEMS_PER_PAGE);
  const currentGroup = Math.ceil(page / MAX_PAGE_BUTTONS);
  const groupStart = (currentGroup - 1) * MAX_PAGE_BUTTONS + 1;
  const groupEnd = Math.min(groupStart + MAX_PAGE_BUTTONS - 1, totalPages);

  const pageData = Array.isArray(safeLetters)
    ? safeLetters.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
    : [];

  return (
    <div className="receivedlist-wrapper">
      <h2 className="receivedlist-title">내 보관소 - 받은 편지함</h2>
      <div className="receivedlist-list">
        {Array.isArray(pageData) && pageData.map(item => (
          <div key={item.id} className={`received-item ${colorClass[item.paper_color]}`}>
            <span className="received-title">[ {item.transcript?.slice(0, 15)}... ]</span>
            <span className="received-user">@{item.sender?.display_id || item.sender?.email}</span>
            <button
              className="received-detail"
              onClick={() => navigate(`/mypage/detail/received/${item.id}`)}
            >
              <img src={arrow} className='arrow' alt="arrow" />
            </button>
          </div>
        ))}
      </div>
      <div className="receivedlist-pagination">
        <button className='pagination-arrow' disabled={page === 1} onClick={() => setPage(page - 1)}>
          <img src={arrowstart} className='arrow-start' alt="prev"/>
        </button>

        {Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => {
          const pageNum = groupStart + i;
          return (
            <button
              key={pageNum}
              className={`pagination-num ${page === pageNum ? "active" : ""}`}
              onClick={() => setPage(pageNum)}
            >{pageNum}</button>
          );
        })}

        <button className='pagination-arrow' disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          <img src={arrow} className='arrow-end' alt="next"/>
        </button>
      </div>
    </div>
  );
};

export default ReceivedList;