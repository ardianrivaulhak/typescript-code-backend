import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Part } from "./part-sequelize";
import { Schedule } from "./schedule-sequelize";
import { Task } from "./task-sequelize";
import { Line } from "./line-sequelize";

export class ProductionOrder extends Model<InferAttributes<ProductionOrder>, InferCreationAttributes<ProductionOrder>> {
    declare id: CreationOptional<string>;
    declare taskId: string;
    declare scheduleId?: string | null;
    declare partId?: string;
    declare actualLineId: string;
    declare qty: number;
    declare purpose: string;
    declare startTime?: Date | null;
    declare finishTime?: Date | null;
    declare status: "pending" | "running" | "complete";
    declare actualOutput: number;
    declare ngCount: number;
    declare cycleTime: number;
    declare task?: NonAttribute<Task>;
    declare schedule?: NonAttribute<Schedule>;
    declare part?: NonAttribute<Part>;
    declare actualLine?: NonAttribute<Line>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    declare static associations: {
        task: Association<ProductionOrder, Task>;
        schedule: Association<ProductionOrder, Schedule>;
        part: Association<ProductionOrder, Part>;
        actualLine: Association<ProductionOrder, Line>;
    };
}

ProductionOrder.init(
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
        scheduleId: {
            type: DataTypes.STRING,
            references: {
                model: Schedule,
            },
        },
        partId: {
            type: DataTypes.STRING,
            references: {
                model: Part,
            },
        },
        actualLineId: {
            type: DataTypes.STRING,
            references: {
                model: Line,
            },
        },
        qty: DataTypes.INTEGER,
        purpose: DataTypes.STRING,
        startTime: DataTypes.DATE,
        finishTime: DataTypes.DATE,
        status: DataTypes.ENUM("pending", "running", "complete"),
        actualOutput: DataTypes.INTEGER,
        ngCount: DataTypes.INTEGER,
        cycleTime: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    {
        tableName: "production_orders",
        modelName: "production_order",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
