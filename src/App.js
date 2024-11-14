import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';

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
        <Navbar /> {/* 네비게이션 바 추가 */}

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>AI 기반 얼굴형 분석 및 헤어스타일 추천</p>
          <p className="upload-instruction">(사진을 업로드해주세요)</p>

          <input
            type="file"
            accept="image/*"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button type="button" onClick={handleButtonClick}>사진 업로드</button>
          {file && <p>업로드된 파일: {file.name}</p>}
        </header>

        <footer className="App-footer">
          <Link to="/signup">회원가입</Link> | 
          <Link to="/login"> 로그인</Link>
        </footer>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/member-service" element={<MemberService />} />  {/* 회원 서비스 임시 페이지 */}
          <Route path="/about" element={<About />} />  {/* About 임시 페이지 */}
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
