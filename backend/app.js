require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const PORT = process.env.PORT;

// 빌드된 React 파일 제공 (정적 파일)
app.use(express.static(path.join(__dirname, 'build')));
// 모든 라우트를 index.html로 리다이렉트
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})