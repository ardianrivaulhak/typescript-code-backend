import { IPart, Part } from "../models/part";
import { TableData } from "../models/table-data";
import { TDataTableParam, TPagination } from "@/domain/service/types";
import { PartHasMethod } from "../models/part_has_method";

export interface PartRepository {
    findAll(): Promise<Part[]>;
    findById(part_id: string): Promise<Part>;
    getDataTable(param: TDataTableParam): Promise<TableData<IPart>>;
    store(part: Part, method_id: string[]): Promise<Part>;
    import(machine: Part[], method_id: string[]): Promise<Part[]>;
    update(part_id: string, part: IPart, method_id: string[]): Promise<void>;
    destroy(part_id: string): Promise<boolean>;
    pagination(param: TPagination): Promise<TableData<IPart>>;
}
