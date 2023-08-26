import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Role } from "./role-sequelize";
import { SessionLogin } from "./session-login-sequelize";

export class User extends Model<InferAttributes<User, { omit: "role" }>, InferCreationAttributes<User, { omit: "role" }>> {
  declare id: CreationOptional<string>;
  declare roleId: string;
  declare email: string;
  declare password: CreationOptional<string> | null;
  declare name: string;
  declare isActive: boolean;
  declare photoUrl: string;
  declare role?: NonAttribute<Role>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare static associations: {
    role: Association<User, Role>;
    session: Association<User, SessionLogin>;
  };
}

User.init(
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
    email: {
      unique: true,
      type: DataTypes.STRING,
    },
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    isActive: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    photoUrl: {
      defaultValue: "",
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "users",
    modelName: "user",
    underscored: true,
    paranoid: true,
    timestamps: true,
    sequelize,
  }
);
