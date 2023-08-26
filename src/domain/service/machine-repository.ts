import { IMachine, Machine } from "../models/machine";
import { TableData } from "../models/table-data";
import { TDataTableParam, TPagination } from "@/domain/service/types";

export interface MachineRepository {
    findAll(): Promise<Machine[]>;
    findById(machine_id: string): Promise<Machine>;
    getDataTable(param: TDataTableParam): Promise<TableData<IMachine>>;
    store(machine: Machine): Promise<Machine>;
    import(machine: Machine[]): Promise<Machine[]>;
    update(machine_id: string, machine: IMachine): Promise<void>;
    destroy(machine_id: string): Promise<boolean>;
    pagination(param: TPagination): Promise<TableData<IMachine>>;
}
