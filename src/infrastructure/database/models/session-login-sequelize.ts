import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Association } from "sequelize";
import { Machine } from "./machine-sequelize";
import { sequelize } from "../sequelize";
import { Shifts } from "./shifts-sequelize";

export class SessionLogin extends Model<InferAttributes<SessionLogin>, InferCreationAttributes<SessionLogin>> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare machineId: string;
  declare shiftId: string;
  declare loginTime: Date;
  declare logoutTime?: Date | null;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date>;
  declare machine?: NonAttribute<Machine>;
  declare shift?: NonAttribute<Shifts>;
  declare static association: { machine: Association<SessionLogin, Machine>; shift: Association<SessionLogin, Shifts> };
}

SessionLogin.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: DataTypes.STRING,
    machineId: DataTypes.STRING,
    shiftId: DataTypes.STRING,
    loginTime: DataTypes.DATE,
    logoutTime: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    tableName: "session_login",
    modelName: "session_login",
    underscored: true,
    paranoid: true,
    sequelize,
  }
);
