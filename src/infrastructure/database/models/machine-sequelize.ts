import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Line } from "./line-sequelize";

export class Machine extends Model<InferAttributes<Machine>, InferCreationAttributes<Machine>> {
  declare id: CreationOptional<string>;
  declare no_machine: CreationOptional<number>;
  declare name: CreationOptional<string>;
  declare line_id: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date>;
  declare line?: NonAttribute<Line>;
  declare static association: { line: Association<Machine, Line> };
}

Machine.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    no_machine: DataTypes.INTEGER,
    name: DataTypes.STRING,
    line_id: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    tableName: "machines",
    modelName: "machine",
    underscored: true,
    paranoid: true,
    sequelize,
  }
);
