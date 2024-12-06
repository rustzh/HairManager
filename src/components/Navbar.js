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
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setUsername('');
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
              <h2>{username}님</h2>
              <h2 onClick={handleLogout} style={{ cursor: 'pointer', color: 'blue' }}>
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
