import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const Category = sequelize.define("category", {
  Cid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Cname: { type: DataTypes.STRING, allowNull: false },
  Cdescription: { type: DataTypes.STRING, allowNull: false },
  Cstatus: { type: DataTypes.INTEGER, allowNull: false },
  CcreatedAt: { type: DataTypes.DATE, field: 'Ccreated', defaultValue: DataTypes.NOW, allowNull: false }, 
  CupdatedAt: { type: DataTypes.DATE, field: 'Cupdated', defaultValue: DataTypes.NOW, allowNull: false }, 
  CdeletedAt: { type: DataTypes.DATE, field: 'Cdeleted', defaultValue: DataTypes.NOW, allowNull: false }, 
}, {
  timestamps: false, 
  paranoid: false 
})

