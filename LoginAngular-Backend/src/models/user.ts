import { DataTypes } from "sequelize";
import sequelize from "../database/connection";

export const User = sequelize.define("user", {
    Uid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    Uname: { type: DataTypes.STRING, allowNull: false },
    Ulastname: { type: DataTypes.STRING, allowNull: false },
    Uemail: { type: DataTypes.STRING, unique: true, allowNull: false },
    Upassword: { type: DataTypes.STRING, unique: true, allowNull: false },
    Ucredential: { type: DataTypes.STRING, unique: true, allowNull: false },
    Ustatus: { type: DataTypes.INTEGER, allowNull: false },
});
