import { TDataTableParam } from "@/domain/service/types";
import { IAccess, Access } from "../models/access";
import { TableData } from "../models/table-data";

export interface AccessRepository {
  findAll(): Promise<Access[]>;
  findAllParentAccess(): Promise<Access[]>;
  findById(id: string): Promise<Access>;
  getDataTable(param: TDataTableParam): Promise<TableData<IAccess>>;
  store(role: IAccess): Promise<Access>;
  update(id: string, user: IAccess): Promise<Access>;
  destroy(id: string): Promise<boolean>;
}
