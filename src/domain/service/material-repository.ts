import { TDataTableParam, TPagination } from "@/domain/service/types";
import { IMaterial, Material } from "../models/material";
import { TableData } from "../models/table-data";
import { Transaction } from "sequelize";

export interface MaterialRepository {
    findAll(): Promise<Material[]>;
    findAllByPartId(partId: string): Promise<Material[]>;
    findAllByPartIdBulk(partId: (string | undefined)[], transaction?: Transaction): Promise<Material[]>;
    findById(material_id: string): Promise<Material>;
    getDataTable(param: TDataTableParam): Promise<TableData<IMaterial>>;
    store(material: Material): Promise<Material>;
    import(material: Material[]): Promise<Material[]>;
    update(material_id: string, material: IMaterial): Promise<void>;
    destroy(material_id: string): Promise<boolean>;
    pagination(param: TPagination): Promise<TableData<IMaterial>>;

}
