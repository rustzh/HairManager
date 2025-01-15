import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MemberService() {
  const [blocks, setBlocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/record/history`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const newBlocks = data.map((item) => ({
        id: item.id,
        date: item.createdAt?.split("T")[0] || "Unknown",
        imageUrl: item.imageUrl,
        data: item.FaceType,
      }));
      setBlocks(newBlocks);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const showHistory = (block) => {
    navigate("/analysis-result", {
      state: {
        fromResultPage: false,
        data: block.data,
        uploadedImageUrl: block.imageUrl,
      },
    });
  };

  return (
    <div className="MemberService">
      <h1>기록 저장소</h1>
      <p>
        기록 저장소입니다. 원하는 블록을 눌러 저장된 기록을 확인하실 수
        있습니다.
      </p>
      <div className="HistoryContainer">
        {blocks.length > 0 ? (
          blocks.map((block) => (
            <div
              key={block.id}
              className="historyBlock"
              onClick={() => showHistory(block)}
            >
              <img
                src={block.imageUrl}
                alt="Hair style"
                style={{ maxWidth: "100%", borderRadius: "5px" }}
              />
              <div className="date">{block.date}</div>
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
