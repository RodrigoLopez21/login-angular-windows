import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const LoginHistory = sequelize.define("login_history", {
    Lhid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Uid: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'Uid' } },
    Lhlogin_time: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    Lhlogout_time: { type: DataTypes.DATE, allowNull: true },
}, {
    timestamps: false
});
