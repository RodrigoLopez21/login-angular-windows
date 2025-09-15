import { Sequelize } from "sequelize";

const sequelize = new Sequelize('loginangular', 'root', 'NuevaClaveFuerte123!', {
  dialect: 'mysql',
  host: 'localhost',
  dialectOptions: {
    socketPath: '/tmp/mysql.sock'
  },
  logging: false
});

export default sequelize;
