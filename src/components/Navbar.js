import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    // 토큰이 존재하면 사용자 정보를 가져오기
    if (accessToken) {
      axios
        .get('http://localhost:5000/api/auth', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setIsLoggedIn(true);
          setUsername(response.data.username);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error.response);
          setIsLoggedIn(false);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]); // isLoggedIn 상태가 변할 때마다 실행

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      // 로그아웃 요청
      await axios.get('http://localhost:5000/api/users/logout', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // 로컬스토리지에서 토큰 제거
      localStorage.removeItem('accessToken');

      // 상태 업데이트
      setIsLoggedIn(false);
      setUsername('');  // username 초기화

      // 알림 표시
      alert('로그아웃 되었습니다.');

      navigate('/'); // 홈 페이지로 이동
      
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>

        {/* 로그인 상태일 때만 회원 서비스 링크를 보여주기 */}
        {isLoggedIn && (
          <li>
            <Link to="/member-service">회원 서비스</Link>
          </li>
        )}

        <li>
          <Link to="/about">About</Link>
        </li>

        <div className="right-links">
          {isLoggedIn ? (
            <>
              <h2 className="username" style={{ color: 'white' }}>
                {username}님
              </h2>

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
              <h2>
                <Link to="/signup">회원가입</Link>
              </h2>
              <h2>
                <Link to="/login">로그인</Link>
              </h2>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;