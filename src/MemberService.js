import React, { useEffect, useState } from 'react';

function MemberService() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/record/history");
      const data = await response.json();
      const newBlocks = data.map((item) => ({
        id: item.id,
        faceType: item.FaceType.typeName,
        date: item.createdAt.split("T")[0],
        hairStyle: item.FaceType.hairName,
        imageUrl: item.imageUrl, // imageUrl 추가
      }));
      setBlocks(newBlocks);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // showHistory 함수 정의: 클릭된 기록을 처리하는 예시
  const showHistory = (block) => {
    // 여기에서 block의 자세한 내용을 표시하는 로직을 추가할 수 있습니다.
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
              <div className="cell">{block.faceType}</div>
              <div className="cell">{block.date}</div>
              <div className="cell">{block.hairStyle}</div>
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

export default MemberService;
