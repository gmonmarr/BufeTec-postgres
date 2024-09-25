// config/database.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,          // Maximum number of connections in the pool
    min: 0,          // Minimum number of connections in the pool
    acquire: 30000,  // Maximum time (in ms) that the pool will try to get a connection before throwing an error
    idle: 10000      // Maximum time (in ms) that a connection can be idle before being released
  }
});

module.exports = sequelize;
