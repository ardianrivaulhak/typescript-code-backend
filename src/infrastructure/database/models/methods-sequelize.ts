import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";

export class Method extends Model<InferAttributes<Method>, InferCreationAttributes<Method>> {
    declare id: CreationOptional<string>;
    declare no_method: CreationOptional<string>;
    declare name: CreationOptional<string>;
    declare file_url: CreationOptional<string>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare deleted_at: CreationOptional<Date>;
}

Method.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        no_method: DataTypes.STRING,
        name: DataTypes.STRING,
        file_url: DataTypes.STRING,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE,
    },
    {
        tableName: "methods",
        modelName: "method",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
