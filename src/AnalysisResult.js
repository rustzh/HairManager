import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AnalysisResult.css";
import { upload } from "@testing-library/user-event/dist/upload";

function AnalysisResult({ setPreview }) {
  // const [hairImage, setHairImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const fromResultPage = location.state?.fromResultPage;
  const analysisResult = location.state.data;
  let uploadedImage, uploadedImageUrl;
  if (fromResultPage) {
    // 결과 조회 화면에서 넘어온 경우
    uploadedImage = location.state?.uploadedImage;
    uploadedImageUrl = URL.createObjectURL(uploadedImage);
  } else {
    // 기록 저장소에서 넘어온 경우
    uploadedImageUrl = location.state?.uploadedImageUrl;
  }
  const isLoggedIn = sessionStorage.getItem("accessToken");

  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    if (!analysisResult) {
      alert("저장할 데이터가 없습니다.");
      return;
    }

    // 저장할 데이터 객체 생성
    const dataToSave = {
      fileName: analysisResult.fileName,
      typeCode: analysisResult.typeCode,
    };

    try {
      const accessToken = sessionStorage.getItem("accessToken");

      const response = await axios.post("/api/record/save", dataToSave, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        alert(response.data.message); // save.js에서 받은 저장 성공 메시지 표시
      } else {
        alert(response.data.message); // save.js에서 받은 저장 실패 메시지 표시
      }
    } catch (error) {
      console.error("Error saving result:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 홈으로 버튼 클릭 핸들러
  const handleHomeClick = () => {
    setPreview(null); // 미리보기 초기화
    navigate("/"); // 홈으로 이동
  };

  return (
    <div className="AnalysisResult">
      <h1 className="title">분석 결과</h1>
      <div className="image-section">
        <div className="image-box">
          <img src={uploadedImageUrl} alt="업로드 이미지" />
        </div>
        <div className="image-box">헤어 이미지</div>
      </div>
      <h2 className="subtitle">{analysisResult.hairName}</h2>
      <div className="recommendation-list">
        <p>회원님의 얼굴형은 {analysisResult.typeName}</p>
        <p>{analysisResult.typeDesc}</p>
        <p>{analysisResult.hairDesc}</p>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button style={styles.button} onClick={handleHomeClick}>
          홈으로
        </button>
        {isLoggedIn && fromResultPage && (
          <button style={styles.button} onClick={handleSave}>
            저장
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  button: {
    margin: "0 10px",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AnalysisResult;
