import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';

const logo = '/my_logo.png';

function MemberService() {
  return (
    <div className="MemberService">
      회원 서비스 기능 준비중...
    </div>
  );
}

function About() {
  return (
    <div className="About">
      About 페이지 준비중...
    </div>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [gender, setGender] = useState('');

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  const handleButtonClick = () => {
    document.getElementById('file-upload').click();
  };

  return (
    <Router>
      <div className="App">
        <Navbar />

        <header className="App-header">
          <div className="logo-container">
            <img src={logo} className="App-logo" alt="logo" />
            <div className="speech-bubble">
            안녕하세요! 저는 AI입니다.<br />
            헤어스타일을 추천해드릴게요!
            </div>
          </div>
          <p>AI 기반 얼굴형 분석 및 헤어스타일 추천</p>

          {/* 성별 선택 */}
          <div className="gender-selection">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={handleGenderChange}
              />
              남성
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={handleGenderChange}
              />
              여성
            </label>
          </div>

          <p className="upload-instruction">(성별 선택 후 사진을 업로드해주세요)</p>

          <input
            type="file"
            accept="image/*"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            disabled={!gender}
          />
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={!gender}
          >
            사진 업로드
          </button>
          {file && (
            <p>
              업로드된 파일: {file.name} | 선택한 성별: {gender === 'male' ? '남성' : '여성'}
            </p>
          )}
        </header>

        <footer className="App-footer">
          <Link to="/signup">회원가입</Link> | 
          <Link to="/login"> 로그인</Link>
        </footer>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/member-service" element={<MemberService />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="Home">
      <h2>클라우드컴퓨팅 5팀입니다.</h2>
    </div>
  );
}

export default App;
