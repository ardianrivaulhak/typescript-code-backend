import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Part } from "./part-sequelize";

export class Material extends Model<InferAttributes<Material>, InferCreationAttributes<Material>> {
  declare id: CreationOptional<string>;
  declare part_id: CreationOptional<string>;
  declare name: CreationOptional<string>;
  declare no_material: CreationOptional<string>;
  declare qty: CreationOptional<number>;
  declare part?: NonAttribute<Part>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Material.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    part_id: DataTypes.STRING,
    name: DataTypes.STRING,
    no_material: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "materials",
    modelName: "material",
    underscored: true,
    paranoid: true,
    sequelize,
  }
);
