import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import MemberService from "./MemberService";
import { AuthContext } from "./context/AuthContext"; // AuthContext import
import axios from "axios";

const logo = "/my_logo.png";

function About() {
  return (
    <div className="About">
      <h2>About</h2>
      <p>
        HairManager는 업로드된 사용자의 사진을 기반으로
        <br />
        <br />
        AI를 활용해 얼굴형을 분석하고 사용자의 얼굴형에 맞는
        <br />
        <br />
        최적의 헤어스타일을 추천합니다.
      </p>
    </div>
  );
}

function App() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // AuthContext에서 상태 가져오기
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [analysisResult, setAnalysisResult] = useState(null); // 분석 결과 데이터
  const [preview, setPreview] = useState(null); // 이미지 미리보기 URL
  const [gender, setGender] = useState(""); // 성별 선택
  const [bubbleMessage, setBubbleMessage] = useState(
    "안녕하세요! 저는 AI입니다.\n헤어스타일을 추천해드릴게요!"
  );

  // 성별 변경 핸들러
  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setBubbleMessage("정면 사진을 업로드 해주세요!");
  };

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setPreview(URL.createObjectURL(uploadedFile)); // 미리보기 URL 생성
    }
  };

  // 사진 업로드 버튼 클릭 핸들러
  const handleButtonClick = () => {
    if (!gender) {
      setBubbleMessage("먼저 성별을 선택해주세요!");
      return;
    }
    document.getElementById("file-upload").click();
  };

  // 사진 변경 핸들러
  const handleChangeImage = () => {
    setPreview(null);
    document.getElementById("file-upload").click();
  };

  const handleConfirmImage = async () => {
    if (!preview) {
      alert("이미지를 먼저 업로드해주세요.");
      return;
    }

    setIsLoading(true); // 로딩 상태 활성화

    // FormData 생성
    const formData = new FormData();
    formData.append("gender", gender);
    formData.append("file", document.getElementById("file-upload").files[0]);

    try {
      // 서버로 이미지와 성별 전송
      const response = await axios.post("/api/record/run", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setAnalysisResult(response.data); // 분석 결과 저장
        alert("이미지 분석이 완료되었습니다.");
      } else {
        alert("이미지 분석에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("이미지 분석에 실패했습니다.");
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
      setPreview(null); // 미리보기 초기화
    }
  };

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인하여 로그인 상태 설정
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken); // 토큰이 있으면 로그인 상태로 설정
  }, [setIsLoggedIn]);

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
                    <div className={`speech-bubble ${preview ? "hidden" : ""}`}>
                      {bubbleMessage.split("\n").map((line, index) => (
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

                  <p className="upload-instruction">
                    (성별 선택 후 정면이 나온 사진을 업로드해주세요)
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    id="file-upload"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <button type="button" onClick={handleButtonClick}>
                    사진 업로드
                  </button>

                  {/* 로딩 상태 */}
                  {isLoading && (
                    <p>이미지 분석 중입니다. 잠시만 기다려주세요...</p>
                  )}

                  {/* 분석 결과 */}
                  {analysisResult && (
                    <div className="analysis-result">
                      <h3>분석 결과</h3>
                      <p>얼굴형: {analysisResult.typeName}</p>
                      <p>설명: {analysisResult.typeDesc}</p>
                      <p>추천 헤어스타일: {analysisResult.hairName}</p>
                      <p>헤어스타일 설명: {analysisResult.hairDesc}</p>
                    </div>
                  )}

                  {/* 미리보기 창 */}
                  {preview && (
                    <>
                      <div className="preview-overlay"></div>
                      <div className="preview-container">
                        <h3>미리보기</h3>
                        <img
                          src={preview}
                          alt="Preview"
                          className="preview-image"
                        />
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
          <Route
            path="/login"
            element={<LoginForm setIsLoggedIn={setIsLoggedIn} />}
          />

          {/* 기록 저장소 페이지 */}
          <Route path="/member-service" element={<MemberService />} />

          {/* About 페이지 */}
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
