import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { Task } from "./task-sequelize";
import { Material } from "./material-sequelize";

export class ProductionMaterial extends Model<InferAttributes<ProductionMaterial>, InferCreationAttributes<ProductionMaterial>> {
    declare id: CreationOptional<string>;
    declare taskId: string;
    declare materialId: string;
    declare lotNo?: string;
    declare remark?: string;
    declare task?: Task;
    declare material?: Material;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    declare static associations: {
        task: Association<ProductionMaterial, Task>;
        material: Association<ProductionMaterial, Material>;
    };
}

ProductionMaterial.init(
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
        materialId: {
            type: DataTypes.STRING,
            references: {
                model: Material,
            },
        },
        lotNo: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        remark: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    {
        tableName: "production_materials",
        modelName: "production_material",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
