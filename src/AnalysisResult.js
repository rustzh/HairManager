import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AnalysisResult() {
  const location = useLocation();
  const analysisResult = location.state;
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10분을 초로 설정 (10 * 60 = 600초)
  const [showAlert, setShowAlert] = useState(false); // 메시지 표시 여부

  // 타이머 시작
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          clearInterval(timer); // 타이머 종료
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  // 10분이 됐을 때
  useEffect(() => {
    if (timeLeft === 0 && !showAlert) {
      // 10분이 지난 후에 자동으로 만료 메시지를 띄움
      alert("이미지 세션이 만료되었습니다.");
      setShowAlert(true);
    }
  }, [timeLeft, showAlert]); // timeLeft가 0이 되면 실행
  
  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    if (timeLeft > 0) {
      // 10분이 지나지 않았으면 정상적으로 저장
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
          alert(response.data.message); // save.js에서 받은 성공 메시지 표시
        } else {
          alert("결과 저장에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error saving result:", error);
        alert("저장 중 오류가 발생했습니다.");
      }
    } else {
      // 10분이 지나면 저장 불가능, 서버에서 받은 메시지 표시
      try {
        const response = await axios.post("/api/record/save", {
        });
  
        alert(response.data.message); // save.js에서 받은 실패 메시지 표시
      } catch (error) {
        console.error("Error saving result:", error);
        alert("저장 중 오류가 발생했습니다.");
      }
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
          onClick={() => navigate("/")}
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