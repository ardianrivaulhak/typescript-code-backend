import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Role } from "./role-sequelize";
import { Access } from "./access-sequelize";
import { Permission } from "./permission-sequelize";

export class AccessPermission extends Model<InferAttributes<AccessPermission>, InferCreationAttributes<AccessPermission>> {
  declare id: CreationOptional<string>;
  declare roleId: string;
  declare accessId: string;
  declare permissionId: string;
  declare status: boolean;
  declare isDisabled: boolean;
  declare roles?: NonAttribute<Role[]>;
  declare accessess?: NonAttribute<Access[]>;
  declare permissions?: NonAttribute<Permission[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare static associations: {
    roles: Association<AccessPermission, Role>;
    accesses: Association<AccessPermission, Access>;
    permissions: Association<AccessPermission, Permission>;
  };
}

AccessPermission.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.STRING,
      references: {
        model: Role,
      },
    },
    accessId: {
      type: DataTypes.STRING,
      references: {
        model: Access,
      },
    },
    permissionId: {
      type: DataTypes.STRING,
      references: {
        model: Permission,
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDisabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "access_permissions",
    modelName: "access_permission",
    underscored: true,
    paranoid: true,
    timestamps: true,
    sequelize,
  }
);
