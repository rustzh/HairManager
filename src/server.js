const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL 연결 설정
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // MySQL 사용자 이름
  password: "", // MySQL 비밀번호
  database: "hairmanager", // 연결할 데이터베이스 이름
});

db.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err);
    return;
  }
  console.log("MySQL에 연결되었습니다.");
});

// 예제 API 엔드포인트
app.get("/data", (req, res) => {
  db.query("SELECT * FROM user", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

app.listen(3001, () => {
  console.log("서버가 3001 포트에서 실행 중입니다.");
});
