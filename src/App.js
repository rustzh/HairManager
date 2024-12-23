import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import AnalysisResult from "./AnalysisResult"; // 분석 결과 페이지 import
import { AuthContext } from "./context/AuthContext"; // AuthContext import
import axios from "axios";

const logo = "/my_logo.png";

function MemberService() {
  const [blocks, setBlocks] = useState([]);
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      const response = await fetch("/api/record/history", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const newBlocks = data.map((item) => ({
        id: item.id,
        date: item.createdAt?.split("T")[0] || "Unknown",
        typeCode: item.typeCode,
        typeName: item.FaceType?.typeName || "Unknown",
        typeDesc: item.FaceType?.typeDesc || "Unknown",
        hairName: item.FaceType?.hairName || "Unknown",
        hairDesc: item.FaceType?.hairDesc || "Unknown",
        fileName: item.imageUrl,
      }));
      setBlocks(newBlocks);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const showHistory = (block) => {
    // 분석 결과 페이지로 이동하며 선택된 block 데이터를 전달
    navigate("/analysis-result", {
      state: {
        typeCode: block.typeCode,
        typeName: block.typeName,
        typeDesc: block.typeDesc,
        hairName: block.hairName,
        hairDesc: block.hairDesc,
        fileName: block.imageUrl,
      },
    });
  };

  return (
    <div className="MemberService">
      <h1>기록 저장소</h1>
      <p>
        기록 저장소입니다. 원하는 블록을 눌러 저장된 기록을 확인하실 수 있습니다.
      </p>
      <div className="HistoryContainer">
        {blocks.length > 0 ? (
          blocks.map((block) => (
            <div
              key={block.id}
              className="historyBlock"
              onClick={() => showHistory(block)}
            >
              <div className="cell">{block.typeName}</div>
              <div className="cell">{block.date}</div>
              <div className="cell">{block.hairName}</div>
              <img
                src={block.imageUrl}
                alt="Hair style"
                style={{ maxWidth: "100%" }}
              />
            </div>
          ))
        ) : (
          <p>저장된 기록이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

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
  const [preview, setPreview] = useState(null); // 이미지 미리보기 URL
  const [gender, setGender] = useState(""); // 성별 선택
  const [bubbleMessage, setBubbleMessage] = useState(
    "안녕하세요! 저는 AI입니다.\n헤어스타일을 추천해드릴게요!"
  );

  // eslint-disable-next-line no-unused-vars
  const [analysisResult, setAnalysisResult] = useState(null); // 분석 결과 상태
  // eslint-disable-next-line no-unused-vars
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false); // 분석 완료 상태
  const navigate = useNavigate(); // useNavigate hook 사용

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

  // 미리보기 창 확인 버튼 클릭 시
  const handleConfirmImage = () => {
    // 미리보기 창에서 확인을 누르면 이미지 분석 페이지로 이동
    navigate("/image-analysis", { state: { previewImage: preview } });
  };

  // 이미지 분석 요청 함수
  const handleViewResult = async () => {
    if (!preview) {
      alert("이미지를 먼저 업로드해주세요.");
      return;
    }

    setIsLoading(true); // 로딩 상태 활성화

    const formData = new FormData();
    formData.append("gender", gender);
    const fileBlob = await fetch(preview).then((r) => r.blob());
    formData.append("file", fileBlob, "uploaded-image.jpg");

    try {
      const response = await axios.post("/api/record/run", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setAnalysisResult(response.data); // 분석 결과 저장
        setIsAnalysisComplete(true); // 분석 완료 상태 변경
        navigate("/analysis-result", {
          state: { data: response.data, uploadedImage: fileBlob },
        }); // 분석 결과를 전달
      } else {
        alert("이미지 분석에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("이미지 분석에 실패했습니다.");
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  useEffect(() => {
    // 세션 스토리지에서 토큰 확인하여 로그인 상태 설정
    const accessToken = sessionStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken); // 토큰이 있으면 로그인 상태로 설정
  }, [setIsLoggedIn]);

  return (
    <div className="App">
      {/* Navbar는 항상 렌더링됩니다 */}
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setPreview={setPreview}
      />

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
                <button
                  className="upload-button"
                  type="button"
                  onClick={handleButtonClick}
                >
                  사진 업로드
                </button>

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

        {/* 이미지 분석 화면 */}
        <Route
          path="/image-analysis"
          element={
            <div className="analysis-container">
              <h3>이미지 분석을 시작하려면 "결과 조회" 버튼을 클릭해주세요.</h3>
              <img
                src={preview}
                alt="Uploaded preview"
                className="uploaded-image"
              />
              {isLoading ? (
                <p>(이미지 분석 중입니다. 잠시만 기다려주세요...)</p>
              ) : (
                <button onClick={handleViewResult}>결과 조회</button>
              )}
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

        {/* 분석 결과 페이지 */}
        <Route
          path="/analysis-result"
          element={<AnalysisResult setPreview={setPreview} />}
        />
      </Routes>
    </div>
  );
}

export default App;
