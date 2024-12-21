import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AnalysisResult() {
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
      fileName: analysisResult.fileName,  // 이미지 파일명
      typeCode: analysisResult.typeCode,  // 얼굴형 코드
    };

    try {
      const accessToken = sessionStorage.getItem("access_token"); // access_token을 로컬 스토리지에서 가져옴

      // API 호출
      const response = await axios.post(
        "/api/record/save", 
        dataToSave, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
          },
        }
      );

      if (response.status === 200) {
        alert("결과가 성공적으로 저장되었습니다!");
      } else {
        alert("결과 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error saving result:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
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
          onClick={() => navigate("/")} // 홈으로 이동
        >
          홈으로
        </button>
        <button
          style={styles.button}
          onClick={handleSave} // 저장
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