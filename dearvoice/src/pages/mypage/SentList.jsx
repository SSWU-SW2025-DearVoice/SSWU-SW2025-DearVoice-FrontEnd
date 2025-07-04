import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 추가
import '../../styles/SentList.css';
import arrow from '../../assets/images/arrow.png'
import arrowstart from '../../assets/images/arrow-start.png'

const dummyData = [
  { id: 1, title: "할머니, 안녕하세요!", user: "@kimgrandma", color: "pink" },
  { id: 2, title: "슬픈 하루..", user: "@jeongbami", color: "blue" },
  { id: 3, title: "보고 싶다!!!", user: "@bobbyindaeyo", color: "yellow" },
  { id: 4, title: "할머니, 안녕하세요sdfsdfdsdff!", user: "@kimgrandmasdfsdfdf", color: "green" },
  { id: 5, title: "슬픈 하루..", user: "@jeongbami", color: "blue" },
  { id: 6, title: "새로운 하루", user: "@kimgrandma", color: "pink" },
  { id: 7, title: "행복한 하루", user: "@jeongbami", color: "blue" },
  { id: 8, title: "고마워요ㅈㄷㄱㄷㅈㄱㄷㄱㅈㄷㄱㄷ!", user: "@bobbyindaeyo", color: "yellow" },
  { id: 9, title: "잘 지내시죠?", user: "@kimgrandma", color: "green" },
  { id: 10, title: "응원합니다", user: "@jeongbami", color: "blue" },
  { id: 11, title: "새로운 하루", user: "@kimgrandma", color: "pink" },
  { id: 1, title: "할머니, 안녕하세요!", user: "@kimgrandma", color: "pink" },
  { id: 2, title: "슬픈 하루..", user: "@jeongbami", color: "blue" },
  { id: 3, title: "보고 싶다erer!!!", user: "@boeeerbbyindaeyo", color: "yellow" },
  { id: 4, title: "할머니, 안녕하세요sdfsdfdsdff!", user: "@kimgrandmasdfsdfdf", color: "green" },
  { id: 5, title: "슬픈 하루..", user: "@jeongbami", color: "blue" },
  { id: 6, title: "새로운 하루", user: "@kimgrandma", color: "pink" },
  { id: 7, title: "행복한 하루", user: "@jeongbami", color: "blue" },
  { id: 8, title: "고마워요!", user: "@bobbyindaeyo", color: "yellow" },
  { id: 9, title: "잘 지내ㄴㅇㄹㅇㄴㅇㄹㅇ시죠?", user: "@kimㄴㅇㄹㅇgrandma", color: "green" },
  { id: 10, title: "응원합니다", user: "@jeongbami", color: "blue" },
  { id: 11, title: "새로운 하루", user: "@kimgrandma", color: "pink" },
  { id: 1, title: "할머니, 안녕하세요!", user: "@kimgrandma", color: "pink" },
  { id: 2, title: "슬픈 하루..", user: "@jeongbami", color: "blue" },
  { id: 3, title: "보고 싶다!!!", user: "@bobbyindaeyo", color: "yellow" },
  { id: 4, title: "할머니, 안녕하세요sdfsdfdsdff!", user: "@kimgrandmasdfsdfdf", color: "green" },
  { id: 5, title: "슬픈 하루..", user: "@jeongbami", color: "blue" },
  { id: 6, title: "새로운 하루", user: "@kimgrandma", color: "pink" },
  { id: 7, title: "행복한 하루", user: "@jeongbami", color: "blue" },
  { id: 8, title: "고마워요!", user: "@bobbyindaeyo", color: "yellow" },
  { id: 9, title: "잘 지내시죠?", user: "@kimgrandma", color: "green" },
  { id: 10, title: "응원합니다", user: "@jeongbami", color: "blue" },
  { id: 11, title: "새로운 하루", user: "@kimgrandma", color: "pink" },
];

const colorClass = {
  green: "sent-item-green",
  gray: "sent-item-gray",
  yellow: "sent-item-yellow",
  blue: "sent-item-blue",
  pink: "sent-item-pink",
}; //편지 배경 색상 지정용

const ITEMS_PER_PAGE = 5; //한 페이지 당 5개 보여줌 페이지네이션
const MAX_PAGE_BUTTONS = 5; // 한 그룹에 보여줄 페이지 버튼 수

const SentList = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(dummyData.length / ITEMS_PER_PAGE);

  // 페이지네이션 그룹 계산
  const currentGroup = Math.ceil(page / MAX_PAGE_BUTTONS);
  const groupStart = (currentGroup - 1) * MAX_PAGE_BUTTONS + 1;
  const groupEnd = Math.min(groupStart + MAX_PAGE_BUTTONS - 1, totalPages);

  // 최신순 정렬 및 페이지 데이터 추출
  const pageData = dummyData
    .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="sentlist-wrapper">
      <h2 className="sentlist-title">내 보관소 - 보낸 편지함</h2>
      <div className="sentlist-list">
        {pageData.map(item => (
          <div key={item.id} className={`sent-item ${colorClass[item.color]}`}>
            <span className="sent-title">
              [ {item.title.length > 12 ? item.title.slice(0, 8) + "..." : item.title} ]
            </span>
            <span className="sent-user">
              {item.user.length > 12 ? item.user.slice(0, 9) + "..." : item.user}
            </span>
            <button
              className="sent-detail"
              onClick={() => navigate(`/mypage/detail/${item.id}`)}
            >
              <img src={arrow} className='arrow' alt="arrow" />
            </button>
          </div>
        ))}
      </div>
      <div className="sentlist-pagination">
        <button
          className='pagination-arrow'
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
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

        <button
          className='pagination-arrow'
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          <img src={arrow} className='arrow-end' alt="next"/>
        </button>
      </div>
    </div>
  );
};

export default SentList;