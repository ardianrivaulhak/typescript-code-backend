import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { sequelize } from "../sequelize";
import { Line } from "./line-sequelize";
import { Method } from "./methods-sequelize";
import { Equipment } from "./equipment-sequelize";
import { Material } from "./material-sequelize";

export class Part extends Model<InferAttributes<Part>, InferCreationAttributes<Part>> {
    declare id: CreationOptional<string>;
    declare line_id: string;
    declare no_part: string;
    declare name: string;
    declare cycle_time: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare deleted_at: CreationOptional<Date>;
    declare line?: NonAttribute<Line>;
    declare methods?: NonAttribute<Method[]>;
    declare equipment?: NonAttribute<Equipment[]>;
    declare materials?: NonAttribute<Material[]>;

    declare static associations: {
        methods: Association<Part, Method>; // Perbaikan penulisan "methods" menjadi "associations"
        line: Association<Part, Line>;
        equipment: Association<Part, Equipment>;
        materials: Association<Part, Material>;
    };
}

Part.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        no_part: DataTypes.STRING,
        name: DataTypes.STRING,
        line_id: DataTypes.STRING,
        cycle_time: DataTypes.INTEGER,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE,
    },
    {
        tableName: "parts",
        modelName: "part",
        underscored: true,
        paranoid: true,
        timestamps: true,
        sequelize,
    }
);
