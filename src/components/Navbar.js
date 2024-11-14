// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // 스타일 추가 (필요시)

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/member-service">회원 서비스</Link>  {/* 회원 서비스 링크 추가 */}
        </li>
        <li>
          <Link to="/about">About</Link>  {/* About 링크 추가 */}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
