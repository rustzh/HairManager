import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';

const logo = '/my_logo.png';

function MemberService() {
  return (
    <div className="MemberService">
      <h2>회원 서비스</h2>
      <p>회원 서비스 기능 준비중...</p>
    </div>
  );
}

function About() {
  return (
    <div className="About">
      <h2>About</h2>
      <p>
        HairManager는 업로드된 사용자의 사진을 기반으로<br /> 
        <br />
        AI를 활용해 얼굴형을 분석하고 사용자의 얼굴형에 맞는<br /> 
        <br />
        최적의 헤어스타일을 추천합니다.
      </p>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [preview, setPreview] = useState(null);
  const [gender, setGender] = useState('');
  const [bubbleMessage, setBubbleMessage] = useState(
    '안녕하세요! 저는 AI입니다.\n헤어스타일을 추천해드릴게요!'
  );

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setBubbleMessage('정면 사진을 업로드 해주세요!');
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };

  const handleButtonClick = () => {
    if (!gender) {
      setBubbleMessage('먼저 성별을 선택해주세요!');
      return;
    }
    document.getElementById('file-upload').click();
  };

  const handleChangeImage = () => {
    setPreview(null);
    document.getElementById('file-upload').click();
  };

  const handleConfirmImage = () => {
    alert('이미지 선택이 완료되었습니다.');
    setPreview(null);
  };

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인하여 로그인 상태 설정
    const accessToken = localStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken); // 토큰이 있으면 로그인 상태로 설정
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Navbar에 isLoggedIn 전달 */}
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <Routes>
          {/* 메인 화면 */}
          <Route
            path="/"
            element={
              <div>
                <header className="App-header">
                  <div className="logo-container">
                    <img src={logo} className="App-logo" alt="logo" />
                    <div className={`speech-bubble ${preview ? 'hidden' : ''}`}>
                      {bubbleMessage.split('\n').map((line, index) => (
                        <span key={index}>
                          {line}
                          <br />
                        </span>
                      ))}
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

                  <p className="upload-instruction">(성별 선택 후 정면이 나온 사진을 업로드해주세요)</p>

                  <input
                    type="file"
                    accept="image/*"
                    id="file-upload"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={handleButtonClick}
                  >
                    사진 업로드
                  </button>

                  {/* 미리보기 창 */}
                  {preview && (
                    <>
                      {/* 오버레이 */}
                      <div className="preview-overlay"></div>
                      {/* 미리보기 창 */}
                      <div className="preview-container">
                        <h3>미리보기</h3>
                        <img src={preview} alt="Preview" className="preview-image" />
                        <div className="preview-buttons">
                          <button onClick={handleChangeImage}>변경</button>
                          <button onClick={handleConfirmImage}>확인</button>
                        </div>
                      </div>
                    </>
                  )}
                </header>
              </div>
            }
          />
          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<SignupForm />} />
          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
          {/* 회원 서비스 페이지 */}
          <Route path="/member-service" element={isLoggedIn ? <MemberService /> : <LoginForm setIsLoggedIn={setIsLoggedIn} />} />
          {/* About 페이지 */}
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;