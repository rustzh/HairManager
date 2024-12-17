const sequelize = require('../config/db');
const User = require('./User');
const History = require('./History');

// User와 Post 간 1:N 관계 설정
User.hasMany(History, { foreignKey: 'userId', as: 'histories' });
History.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Sequelize Sync
sequelize.sync({ force: true })
    .then(() => console.log('Database synced!'))
    .catch(err => console.error('Error syncing database:', err));