import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { ProductionOrder } from "./production-order-sequelize";
import { Problem } from "./problem-sequelize";

export class ProductionProblem extends Model<InferAttributes<ProductionProblem>, InferCreationAttributes<ProductionProblem>> {
    declare id: CreationOptional<string>;
    declare productionOrderId: string;
    declare problemId: string;
    declare startTime: Date;
    declare finishTime: Date;
    declare remark: string;
    declare productionOrder?: ProductionOrder;
    declare problem?: Problem;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    declare static associations: {
        productionOrder: Association<ProductionProblem, ProductionOrder>;
        problem: Association<ProductionProblem, Problem>;
    };
}

ProductionProblem.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        productionOrderId: {
            type: DataTypes.STRING,
            references: {
                model: ProductionOrder,
            },
        },
        problemId: {
            type: DataTypes.STRING,
            references: {
                model: Problem,
            },
        },
        startTime: DataTypes.DATE,
        finishTime: DataTypes.DATE,
        remark: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    {
        tableName: "production_problems",
        modelName: "production_problem",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
