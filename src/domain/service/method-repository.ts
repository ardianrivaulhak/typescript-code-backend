import { IListMethodHMI } from "@/dto/method-dto";
import { IMethod, Method } from "../models/methods";
import { PaginationData } from "../models/pagination-data";
import { TableData } from "../models/table-data";
import { TDataTableParam, TPaginationParam, TPagination } from "@/domain/service/types";

export interface MethodRepository {
    findAll(): Promise<Method[]>;
    findAllByPartId(partId: string, param: TPaginationParam): Promise<PaginationData<IListMethodHMI>>;
    findById(method_id: string): Promise<Method>;
    getDataTable(param: TDataTableParam): Promise<TableData<IMethod>>;
    store(method: Method): Promise<Method>;
    import(machine: Method[]): Promise<Method[]>;
    update(method_id: string, method: IMethod): Promise<Method>;
    destroy(method_id: string): Promise<boolean>;
    pagination(param: TPagination): Promise<TableData<IMethod>>;
}
