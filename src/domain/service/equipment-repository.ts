import { TDataTableParam, TPagination } from "@/domain/service/types";
import { IEquipment, Equipment } from "../models/equipment";
import { TableData } from "../models/table-data";
import { Transaction } from "sequelize";

export interface EquipmentRepository {
    findAll(): Promise<Equipment[]>;
    findById(equipment_id: string): Promise<Equipment>;
    findByIdCanNull(equipment_id: string, transaction?: Transaction): Promise<Equipment | undefined>;
    getDataTable(param: TDataTableParam): Promise<TableData<IEquipment>>;
    store(equipment: Equipment): Promise<Equipment>;
    import(equipment: Equipment[]): Promise<Equipment[]>;
    update(equipment_id: string, equipment: IEquipment): Promise<void>;
    destroy(equipment_id: string): Promise<boolean>;
    findAllNotInParts(partIds: (string | undefined)[], q: string): Promise<IEquipment[]>;
    pagination(param: TPagination): Promise<TableData<IEquipment>>;
}
