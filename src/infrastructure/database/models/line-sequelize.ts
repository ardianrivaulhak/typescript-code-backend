import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";

export class Line extends Model<InferAttributes<Line>, InferCreationAttributes<Line>> {
  declare id: CreationOptional<string>;
  declare no_line: CreationOptional<number>;
  declare name: CreationOptional<string>;
  declare layout_url: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date>;
}

Line.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    no_line: DataTypes.INTEGER,
    name: DataTypes.STRING,
    layout_url: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
  },
  {
    tableName: "lines",
    modelName: "lines",
    underscored: true,
    paranoid: true,
    sequelize,
  }
);
