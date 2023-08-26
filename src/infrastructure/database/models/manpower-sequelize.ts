import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Line } from "./line-sequelize";
import { Machine } from "./machine-sequelize";
import { Position } from "./position-sequelize";

export class Manpower extends Model<InferAttributes<Manpower>, InferCreationAttributes<Manpower>> {
  declare id: CreationOptional<string>;
  declare machineId: CreationOptional<string>;
  declare positionId: CreationOptional<string>;
  declare fullname: CreationOptional<string>;
  declare shortname: CreationOptional<string>;
  declare nip: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date>;
  declare machine?: NonAttribute<Machine>;
  declare position?: NonAttribute<Position>;

  static association: {
    machine: Association<Manpower, Machine>;
    position: Association<Manpower, Position>;
  };
}

Manpower.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    machineId: DataTypes.STRING,
    positionId: DataTypes.STRING,
    fullname: DataTypes.STRING,
    shortname: DataTypes.STRING,
    nip: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    tableName: "manpowers",
    modelName: "manpower",
    underscored: true,
    paranoid: true,
    sequelize,
  }
);
