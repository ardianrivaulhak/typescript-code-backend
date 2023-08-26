import { TDataTableParam, TPagination } from "@/domain/service/types";
import { IDefects, Defects } from "../models/defects";
import { TableData } from "../models/table-data";

export interface DefectsRepository {
    findAll(): Promise<Defects[]>;
    findById(problem_id: string): Promise<Defects>;
    getDataTable(param: TDataTableParam): Promise<TableData<IDefects>>;
    store(problem: Defects): Promise<Defects>;
    import(problem: Defects[]): Promise<Defects[]>;
    update(problem_id: string, problem: IDefects): Promise<void>;
    destroy(problem_id: string): Promise<boolean>;
    pagination(param: TPagination): Promise<TableData<IDefects>>;
}
