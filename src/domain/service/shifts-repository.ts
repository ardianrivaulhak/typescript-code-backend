import { TDataTableParam, TPagination } from "@/domain/service/types";
import { IShifts, Shifts } from "../models/shifts";
import { TableData } from "../models/table-data";

export interface ShiftsRepository {
    findAll(): Promise<Shifts[]>;
    findById(problem_id: string): Promise<Shifts>;
    getDataTable(param: TDataTableParam): Promise<TableData<IShifts>>;
    store(problem: Shifts): Promise<Shifts>;
    import(problem: Shifts[]): Promise<Shifts[]>;
    update(problem_id: string, problem: IShifts): Promise<void>;
    destroy(problem_id: string): Promise<boolean>;
    pagination(param: TPagination): Promise<TableData<IShifts>>;
}
