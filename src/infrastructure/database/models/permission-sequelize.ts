import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { AccessPermission } from "./access-permission-sequelize";

export class Permission extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare accessPermissions?: NonAttribute<AccessPermission[]>;
  declare permissionHasAccess?: NonAttribute<AccessPermission>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare static associations: {
    accessPermissions: Association<Permission, AccessPermission>;
    permissionHasAccess: Association<Permission, AccessPermission>;
  };
}

Permission.init(
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
    tableName: "permissions",
    modelName: "permission",
    underscored: true,
    paranoid: true,
    timestamps: true,
    sequelize,
  }
);
