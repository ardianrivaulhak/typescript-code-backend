import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Part } from "./part-sequelize";
import { Task } from "./task-sequelize";
import { Equipment } from "./equipment-sequelize";

export class ProductionEquipment extends Model<InferAttributes<ProductionEquipment>, InferCreationAttributes<ProductionEquipment>> {
    declare id: CreationOptional<string>;
    declare taskId: string;
    declare equipmentId: string;
    declare partId: string;
    declare note: string;
    declare isChanged: boolean;
    declare isActive: boolean;
    declare task?: Task;
    declare equipment?: Equipment;
    declare part?: Part;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    declare static associations: {
        task: Association<ProductionEquipment, Task>;
        equipment: Association<ProductionEquipment, Equipment>;
        part: Association<ProductionEquipment, Part>;
    };
}

ProductionEquipment.init(
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
        equipmentId: {
            type: DataTypes.STRING,
            references: {
                model: Equipment,
            },
        },
        partId: {
            type: DataTypes.STRING,
            references: {
                model: Part,
            },
        },
        note: DataTypes.STRING,
        isChanged: DataTypes.BOOLEAN,
        isActive: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    {
        tableName: "production_equipments",
        modelName: "production_equipment",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
