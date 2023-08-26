import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Access } from "./access-sequelize";
import { AccessPermission } from "./access-permission-sequelize";

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare accesses?: NonAttribute<Access[]>;
  declare accessPermissions?: NonAttribute<AccessPermission[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare static associations: {
    accesses: Association<Role, Access>;
    accessPermissions: Association<Role, AccessPermission>;
  };
}

Role.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "roles",
    modelName: "role",
    underscored: true,
    paranoid: true,
    timestamps: true,
    sequelize,
  }
);
