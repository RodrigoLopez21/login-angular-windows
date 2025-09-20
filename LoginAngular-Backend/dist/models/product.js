"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../database/connection"));
const category_1 = require("./category");
exports.Product = connection_1.default.define("product", {
    Pid: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Pname: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    Pdescription: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    CategoryId: { type: sequelize_1.DataTypes.INTEGER, references: { model: category_1.Category, key: 'Cid' }, allowNull: false },
    Pstatus: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    PcreatedAt: { type: sequelize_1.DataTypes.DATE, field: 'Pcreated', defaultValue: sequelize_1.DataTypes.NOW, allowNull: false },
    PupdatedAt: { type: sequelize_1.DataTypes.DATE, field: 'Pupdated', defaultValue: sequelize_1.DataTypes.NOW, allowNull: false },
    PdeletedAt: { type: sequelize_1.DataTypes.DATE, field: 'Pdeleted', defaultValue: sequelize_1.DataTypes.NOW, allowNull: false }
}, {
    timestamps: false,
    paranoid: false
});
category_1.Category.hasMany(exports.Product, { foreignKey: 'CategoryId', as: 'products' });
exports.Product.belongsTo(category_1.Category, { foreignKey: 'CategoryId', as: 'categories' });
