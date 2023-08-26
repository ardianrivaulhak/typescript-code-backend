import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Machine } from "./machine-sequelize";
import { Shifts } from "./shifts-sequelize";
import { ProductionOrder } from "./production-order-sequelize";
import { ProductionEquipment } from "./production-equipment-sequelize";
import { ProductionManpower } from "./production-manpower-sequelize";
import { PreparationTimeLog } from "./preparation-time-log-sequelize";

export class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
    declare id: CreationOptional<string>;
    declare machineId: string;
    declare shiftId: string;
    declare status: "running" | "finished";
    declare date: Date;
    declare machine?: NonAttribute<Machine>;
    declare shift?: NonAttribute<Shifts>;
    declare productionOrders?: ProductionOrder[];
    declare productionEquipments?: ProductionEquipment[];
    declare productionManpowers?: ProductionManpower[];
    declare preparationTimeLog?: NonAttribute<PreparationTimeLog>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    declare static associations: {
        machine: Association<Task, Machine>;
        shift: Association<Task, Shifts>;
        productionOrders: Association<Task, ProductionOrder>;
        productionEquipments: Association<Task, ProductionEquipment>;
        productionManpowers: Association<Task, ProductionManpower>;
        preparationTimeLog: Association<Task, PreparationTimeLog>;
    };
}

Task.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        machineId: {
            type: DataTypes.STRING,
            references: {
                model: Machine,
            },
        },
        shiftId: {
            type: DataTypes.STRING,
            references: {
                model: Shifts,
            },
        },
        status: DataTypes.ENUM("running", "finished"),
        date: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    {
        tableName: "tasks",
        modelName: "task",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
