import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Part } from "./part-sequelize";
import { Line } from "./line-sequelize";

export class Schedule extends Model<InferAttributes<Schedule>, InferCreationAttributes<Schedule>> {
    declare id: CreationOptional<string>;
    declare partId: string;
    declare lineId: string;
    declare poNumber: string;
    declare startDate: Date;
    declare endDate: Date;
    declare qty: number;
    declare balance: number;
    declare status: "open" | "closed";
    declare part?: NonAttribute<Part>;
    declare line?: NonAttribute<Line>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    declare static associations: {
    part: Association<Schedule, Part>;
    line: Association<Schedule, Line>;
  };
}

Schedule.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        partId: DataTypes.STRING,
        lineId: DataTypes.STRING,
        poNumber: DataTypes.STRING,
        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE,
        qty: DataTypes.INTEGER,
        balance: DataTypes.INTEGER,
        status: DataTypes.ENUM("open", "closed"),
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    {
        tableName: "schedules",
        modelName: "schedule",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
