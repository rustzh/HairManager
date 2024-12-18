const sequelize = require("../config/db");

const User = require("./User");
const History = require("./History");
const FaceType = require("./FaceType");

// User와 Post 1:N 관계 설정
User.hasMany(History, { foreignKey: "userId" });
History.belongsTo(User, { foreignKey: "userId" });

FaceType.hasMany(History, { foreignKey: "typeCode" });
History.belongsTo(FaceType, { foreignKey: "typeCode" });

// Sequelize Sync (개발 환경에서만 force: true)
// sequelize
//   .sync({ alter: true })
//   .then(() => console.log("Database synced!"))
//   .catch((err) => console.error("Error syncing database:", err));

module.exports = { sequelize, User, History, FaceType };
