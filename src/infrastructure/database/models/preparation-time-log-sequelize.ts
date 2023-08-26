import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Task } from "./task-sequelize";

export class PreparationTimeLog extends Model<InferAttributes<PreparationTimeLog>, InferCreationAttributes<PreparationTimeLog>> {
    declare id: CreationOptional<string>;
    declare taskId: string;
    declare startTime: Date;
    declare finishTime?: Date | null;
    declare task?: NonAttribute<Task>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    declare static associations: {
        task: Association<PreparationTimeLog, Task>;
    };
}

PreparationTimeLog.init(
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
        startTime: DataTypes.DATE,
        finishTime: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    {
        tableName: "preparation_time_logs",
        modelName: "preparation_time_log",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
