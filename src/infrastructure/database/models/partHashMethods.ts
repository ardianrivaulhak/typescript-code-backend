import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Method } from "./methods-sequelize";
import { Part } from "./part-sequelize";

export class PartHasMethods extends Model<InferAttributes<PartHasMethods>, InferCreationAttributes<PartHasMethods>> {
    declare id: CreationOptional<string>;
    declare part_id: CreationOptional<string>;
    declare method_id: CreationOptional<string>;
    declare part: NonAttribute<Part>;
    declare method: NonAttribute<Method>;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare deleted_at: CreationOptional<Date>;
    declare static associations: {
        part: Association<PartHasMethods, Part>;
        method: Association<PartHasMethods, Method>;
    };
}

PartHasMethods.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        part_id: DataTypes.STRING,
        method_id: DataTypes.STRING,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE,
    },
    {
        tableName: "part_has_method",
        modelName: "part_has_method",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
