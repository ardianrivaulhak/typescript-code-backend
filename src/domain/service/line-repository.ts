import { TDataTableParam, TPagination } from "@/domain/service/types";
import { ILine, Line } from "../models/line";
import { TableData } from "../models/table-data";

export interface LineRepository {
    findAll(): Promise<Line[]>;
    findById(line_id: string): Promise<Line>;
    getDataTable(param: TDataTableParam): Promise<TableData<ILine>>;
    store(line: Line): Promise<Line>;
    import(lines: Line[]): Promise<Line[]>;
    storeLayoutUrl(line_id: string, line: ILine): Promise<Line>;
    update(line_id: string, line: ILine): Promise<void>;
    destroy(line_id: string): Promise<boolean>;
    pagination(param: TPagination): Promise<TableData<ILine>>;
}
