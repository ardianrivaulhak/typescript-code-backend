import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Task } from "./task-sequelize";

export class MaterialChangedLog extends Model<InferAttributes<MaterialChangedLog>, InferCreationAttributes<MaterialChangedLog>> {
    declare id: CreationOptional<string>;
    declare taskId: string;
    declare name: string;
    declare from: string;
    declare to: string;
    declare changedBy: string;
    declare logTime: Date;
    declare task?: NonAttribute<Task>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    declare static associations: {
        task: Association<MaterialChangedLog, Task>;
    };
}

MaterialChangedLog.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        taskId: {
            type: DataTypes.STRING,
            references: {
                model: Task,
            },
        },
        name: DataTypes.STRING,
        from: DataTypes.STRING,
        to: DataTypes.STRING,
        changedBy: DataTypes.STRING,
        logTime: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    {
        tableName: "material_changed_logs",
        modelName: "material_changed_log",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
