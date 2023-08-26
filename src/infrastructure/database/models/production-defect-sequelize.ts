import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { ProductionOrder } from "./production-order-sequelize";
import { Depects } from "./depects-sequelize";

export class ProductionDefect extends Model<InferAttributes<ProductionDefect>, InferCreationAttributes<ProductionDefect>> {
    declare id: CreationOptional<string>;
    declare productionOrderId: string;
    declare defectId: string;
    declare date: Date;
    declare qty: number;
    declare remark: string;
    declare productionOrder?: ProductionOrder;
    declare defect?: Depects;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date>;
    declare static associations: {
        productionOrder: Association<ProductionDefect, ProductionOrder>;
        defect: Association<ProductionDefect, Depects>;
    };
}

ProductionDefect.init(
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
        defectId: {
            type: DataTypes.STRING,
            references: {
                model: Depects,
            },
        },
        date: DataTypes.DATE,
        qty: DataTypes.INTEGER,
        remark: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    },
    {
        tableName: "production_defects",
        modelName: "production_defect",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
