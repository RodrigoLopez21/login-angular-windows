import { DataTypes } from "sequelize";
import sequelize from "../database/connection";


export const Role = sequelize.define("role", {
    Rid:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Rname:      { type: DataTypes.STRING, allowNull: false },
    Rstatus:    { type: DataTypes.INTEGER, allowNull: false },
    RcreatedAt: { type: DataTypes.DATE, field: 'Rcreated', defaultValue: DataTypes.NOW, allowNull: false },
    RupdatedAt: { type: DataTypes.DATE, field: 'Rupdated', defaultValue: DataTypes.NOW, allowNull: false },
    RdeletedAt: { type: DataTypes.DATE, field: 'Rdeleted', defaultValue: DataTypes.NOW, allowNull: false }
}, {
    timestamps: false,
    paranoid: false
});