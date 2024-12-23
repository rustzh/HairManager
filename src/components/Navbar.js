import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

function Navbar({ setPreview }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // 초기 상태를 null로 설정
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");

    // 토큰이 존재하면 사용자 정보를 가져오기
    if (accessToken) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/users/auth`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setIsLoggedIn(true);
          setUsername(response.data.username);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error.response);
          setIsLoggedIn(false);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 실행

  // isLoggedIn이 아직 null일 경우 로딩 상태를 표시
  if (isLoggedIn === null) {
    return <div className="loading-message">새로고침 중...</div>; // 새로고침 중 표시
  }

  const handleLogout = async () => {
    const accessToken = sessionStorage.getItem("accessToken");

    try {
      // 로그아웃 요청
      await axios.get("/api/users/logout", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // sessionStorage에서 토큰 제거
      sessionStorage.removeItem("accessToken");

      // 상태 업데이트
      setIsLoggedIn(false);
      setUsername(""); // username 초기화

      // 알림 표시
      alert("로그아웃 되었습니다.");

      navigate("/"); // 홈 페이지로 이동
      window.location.reload(); // 페이지 새로 고침
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleHomeClick = () => {
    setPreview(null); // 미리보기 초기화
    navigate("/"); // 홈으로 이동
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          {/* Link 컴포넌트를 열고 닫음 */}
          <Link to="/" onClick={handleHomeClick}>
            홈
          </Link>
        </li>

        {/* 로그인 상태일 때만 회원 서비스 링크를 보여주기 */}
        {isLoggedIn && (
          <li>
            <Link to="/member-service">기록 저장소</Link>
          </li>
        )}

        <li>
          <Link to="/about">About</Link>
        </li>

        <div className="right-links">
          {isLoggedIn ? (
            <>
              <h2 className="username" style={{ color: "white" }}>
                {username}님
              </h2>

              <h2
                className="logout-button"
                onClick={handleLogout}
                style={{ cursor: "pointer", color: "white" }}
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
