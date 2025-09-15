import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../database/connection";


export const UserHasRoles = sequelize.define("user_has_roles",{
    Uid: { type: DataTypes.INTEGER, primaryKey: true},
    Rid: { type: DataTypes.INTEGER, primaryKey: true}
})