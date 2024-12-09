// sync.js
const sequelize = require('./db');
const User = require('./models/User');

sequelize.sync({ force: true })  // force: true로 설정하면 기존 테이블을 지우고 다시 생성
  .then(() => {
    console.log('Database & tables have been created!');
  })
  .catch((err) => {
    console.error('Error creating tables:', err);
  });
