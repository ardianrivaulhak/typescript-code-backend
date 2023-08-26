import { TDataTableParam } from "@/domain/service/types";
import { IPermission, Permission } from "../models/permission";
import { TableData } from "../models/table-data";

export interface PermissionRepository {
  findAll(): Promise<Permission[]>;
  findById(id: string): Promise<Permission>;
  getDataTable(param: TDataTableParam): Promise<TableData<IPermission>>;
  store(role: IPermission): Promise<Permission>;
  update(id: string, user: IPermission): Promise<Permission>;
  destroy(id: string): Promise<boolean>;
}
