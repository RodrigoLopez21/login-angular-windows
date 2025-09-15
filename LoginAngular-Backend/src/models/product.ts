import { DataTypes } from "sequelize";
import sequelize from "../database/connection";
import { Category } from "./category";

export const Product = sequelize.define("product", {
  Pid:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Pname:        { type: DataTypes.STRING, allowNull: false },
  Pdescription: { type: DataTypes.STRING, allowNull: false },
  CategoryId:   { type: DataTypes.INTEGER, references: {  model: Category, key: 'Cid' },  allowNull: false },
  Pstatus:      { type: DataTypes.INTEGER, allowNull: false },
  PcreatedAt:   { type: DataTypes.DATE, field: 'Pcreated', defaultValue: DataTypes.NOW, allowNull: false },
  PupdatedAt:   { type: DataTypes.DATE, field: 'Pupdated', defaultValue: DataTypes.NOW, allowNull: false },
  PdeletedAt:   { type: DataTypes.DATE, field: 'Pdeleted', defaultValue: DataTypes.NOW, allowNull: false }
}, {
  timestamps: false, 
  paranoid: false 
});

Category.hasMany(Product, { foreignKey: 'CategoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'CategoryId', as: 'categories' });
