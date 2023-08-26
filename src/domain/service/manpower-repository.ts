import { Transaction } from "sequelize";
import { IManpower, Manpower } from "../models/manpower";
import { TableData } from "../models/table-data";
import { TDataTableParam, TPagination } from "@/domain/service/types";

export interface ManpowerRepository {
    findAll(): Promise<Manpower[]>;
    findById(manpower_id: string): Promise<Manpower>;
    getDataTable(param: TDataTableParam): Promise<TableData<IManpower>>;
    store(manpower: Manpower): Promise<Manpower>;
    import(manpower: Manpower[]): Promise<Manpower[]>;
    update(manpower_id: string, manpower: IManpower): Promise<void>;
    destroy(manpower_id: string): Promise<boolean>;
    findAllByMachine(machineId: string): Promise<Manpower[]>;
    findByIdCanNull(manpower_id: string, transaction?: Transaction): Promise<Manpower | undefined>;
    pagination(param: TPagination): Promise<TableData<IManpower>>;
}
