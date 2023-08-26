import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Permission } from "./permission-sequelize";

export class Access extends Model<InferAttributes<Access>, InferCreationAttributes<Access>> {
  declare id: CreationOptional<string>;
  declare parentId?: string | null;
  declare name: string;
  declare children?: NonAttribute<Access[]>;
  declare permission?: NonAttribute<Permission[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare static associations: {
    children: Association<Access, Access>;
  };
}

Access.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    parentId: {
      type: DataTypes.STRING,
      references: {
        model: Access,
      },
    },
    name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "accesses",
    modelName: "access",
    underscored: true,
    paranoid: true,
    timestamps: true,
    sequelize,
  }
);
