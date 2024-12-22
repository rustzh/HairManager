import React, { useEffect, useState } from 'react';

function MemberService() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    try {
      const response = await fetch('/api/record/history'); // 적절한 API 엔드포인트
      const data = await response.json();
      const newBlocks = data.map((item) => ({
        id: item.id,
        faceType: item.FaceType.typeName, // 얼굴형 이름
        date: item.createdAt.split('T')[0], // YYYY-MM-DD 형식으로 날짜 변환
        hairStyle: item.FaceType.hairName, // 헤어스타일 이름
        imageUrl: item.imageUrl // 이미지 URL 추가
      }));
      setBlocks(newBlocks);
    } catch (error) {
      console.error('Failed to fetch history data:', error);
    }
  };

  const showHistory = (block) => {
    // 클릭 시 블록 정보 표시, 예: alert 대신 모달 또는 상세 페이지로 확장 가능
    alert(`얼굴형: ${block.faceType}, 날짜: ${block.date}, 헤어스타일: ${block.hairStyle}, 이미지 URL: ${block.imageUrl}`);
  };

  return (
    <div className="MemberService">
      <h1>기록 저장소</h1>
      <p>기록 저장소입니다. 원하는 블록을 눌러 저장된 기록을 확인하실 수 있습니다.</p>
      <div className="HistoryContainer">
        {blocks.length > 0 ? (
          blocks.map(block => (
            <div key={block.id} className="historyBlock" onClick={() => showHistory(block)}>
              <div className="cell">{block.faceType}</div>
              <div className="cell">{block.date}</div>
              <div className="cell">{block.hairStyle}</div>
              <img src={block.imageUrl} alt="Hair style" style={{ maxWidth: '100%' }} />
            </div>
          ))
        ) : (
          <p>기록이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default MemberService;
