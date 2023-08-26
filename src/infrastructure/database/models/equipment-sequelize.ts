import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Part } from "./part-sequelize";

export class Equipment extends Model<InferAttributes<Equipment>, InferCreationAttributes<Equipment>> {
  declare id: CreationOptional<string>;
  declare part_id: CreationOptional<string>;
  declare name: CreationOptional<string>;
  declare no_equipment: CreationOptional<string>;
  declare part?: NonAttribute<Part>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Equipment.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    part_id: DataTypes.STRING,
    name: DataTypes.STRING,
    no_equipment: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "equipments",
    modelName: "equipment",
    underscored: true,
    paranoid: true,
    sequelize,
  }
);
