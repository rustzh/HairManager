import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AnalysisResult({ setPreview }) {
  const location = useLocation();
  const analysisResult = location.state;
  const navigate = useNavigate();

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
      const accessToken = sessionStorage.getItem("access_token");

      const response = await axios.post(
        "/api/record/save",
        dataToSave,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

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
      <h3>분석 결과</h3>
      <p>얼굴형: {analysisResult.typeName}</p>
      <p>설명: {analysisResult.typeDesc}</p>
      <p>추천 헤어스타일: {analysisResult.hairName}</p>
      <p>헤어스타일 설명: {analysisResult.hairDesc}</p>

      <div style={{ marginTop: "20px" }}>
        <button
          style={styles.button}
          onClick={handleHomeClick}
        >
          홈으로
        </button>
        <button
          style={styles.button}
          onClick={handleSave}
        >
          저장
        </button>
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