import { TDataAssignRoleAccess, TDataTableParam } from "@/domain/service/types";
import { IRole, Role } from "../models/role";
import { TableData } from "../models/table-data";

export interface RoleRepository {
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role>;
  getDataTable(param: TDataTableParam): Promise<TableData<IRole>>;
  store(role: IRole): Promise<Role>;
  update(id: string, user: IRole): Promise<Role>;
  destroy(id: string): Promise<boolean>;
  findByIdWithAccessAndPermission(id: string): Promise<IRole>;
  assignAccessAndPermission(id: string, param: TDataAssignRoleAccess): Promise<boolean>;
}
