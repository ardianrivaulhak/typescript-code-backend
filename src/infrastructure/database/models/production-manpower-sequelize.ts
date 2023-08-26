import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { Task } from "./task-sequelize";
import { Manpower } from "./manpower-sequelize";

export class ProductionManpower extends Model<InferAttributes<ProductionManpower>, InferCreationAttributes<ProductionManpower>> {
    declare id: CreationOptional<string>;
    declare taskId: string;
    declare manpowerId: string;
    declare indicator: "existing" | "subtitution" | "absent";
    declare isActive: boolean;
    declare task?: Task;
    declare manpower?: Manpower;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    declare static associations: {
        task: Association<ProductionManpower, Task>;
        manpower: Association<ProductionManpower, Manpower>;
    };
}

ProductionManpower.init(
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
        manpowerId: {
            type: DataTypes.STRING,
            references: {
                model: Manpower,
            },
        },
        indicator: DataTypes.ENUM("existing", "subtitution", "absent"),
        isActive: DataTypes.BOOLEAN,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    {
        tableName: "production_manpowers",
        modelName: "production_manpower",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
