import { Sequelize } from "sequelize";

const sequelize = new Sequelize('loginangular', 'usuario_app', 'contraseña_segura', {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,   
  logging: false
});

export default sequelize;