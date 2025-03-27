require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(
//   cors({
//     origin: "http://localhost:3000", // 허용할 출처
//     methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드
//     credentials: true, // 쿠키와 인증 정보를 포함
//   })
// );
app.use(cors());

app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
