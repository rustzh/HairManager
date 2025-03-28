import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // AuthContext import
import "./LoginForm.css";

function LoginForm() {
  const { setIsLoggedIn, setUsername } = useContext(AuthContext); // Context에서 상태 변경 함수 가져오기
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 리디렉션을 위한 useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // 에러 메시지 초기화

    try {
      // 서버로 로그인 요청
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      // 로그인 성공 시 사용자 이름과 토큰을 sessionStorage에 저장
      const { accessToken, username } = response.data;

      sessionStorage.setItem("accessToken", accessToken);

      // Context 상태 업데이트
      setIsLoggedIn(true);
      setUsername(username); // 사용자 이름 설정

      // 리디렉션 후 페이지 새로 고침
      navigate("/"); // 홈으로 리디렉션
      window.location.reload(); // 페이지 새로 고침
    } catch (error) {
      console.error("로그인 실패:", error.response || error);
      setError(
        error.response?.data?.message ||
          "로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요."
      );
    }
  };

  return (
    <div className="login-form-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="login-input"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="login-input"
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button">
          로그인
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
