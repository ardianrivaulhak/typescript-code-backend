import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Task } from "./task-sequelize";

export class MethodLog extends Model<InferAttributes<MethodLog>, InferCreationAttributes<MethodLog>> {
    declare id: CreationOptional<string>;
    declare taskId: string;
    declare remark: string;
    declare reportBy: string;
    declare logTime: Date;
    declare task?: NonAttribute<Task>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    declare static associations: {
        task: Association<MethodLog, Task>;
    };
}

MethodLog.init(
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
        remark: DataTypes.STRING,
        reportBy: DataTypes.STRING,
        logTime: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    {
        tableName: "method_logs",
        modelName: "method_log",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
