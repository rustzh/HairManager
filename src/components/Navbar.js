import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // 로그아웃 처리
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setUsername('');

    // Alert 메시지 표시
    alert('로그아웃 되었습니다.');

    // 페이지 새로고침
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">홈</Link></li>
        <li><Link to="/member-service">회원 서비스</Link></li>
        <li><Link to="/about">About</Link></li>

        <div className="right-links">
          {isLoggedIn ? (
            <>
              <h2 className="username" style={{ color: 'white' }}>{username}님</h2>

              <h2 
                className="logout-button" 
                onClick={handleLogout} 
                style={{ cursor: 'pointer', color: 'white' }}
              >
                로그아웃
              </h2>
            </>
          ) : (
            <>
              <h2><Link to="/signup">회원가입</Link></h2>
              <h2><Link to="/login">로그인</Link></h2>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;