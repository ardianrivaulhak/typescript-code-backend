import { TDataTableParam } from "@/domain/service/types";
import { IUser, User } from "../models/user";
import { TableData } from "../models/table-data";

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  findByEmail(string: string): Promise<User>;
  getDataTable(param: TDataTableParam): Promise<TableData<IUser>>;
  store(user: IUser): Promise<User>;
  update(id: string, user: IUser): Promise<User>;
  destroy(id: string): Promise<boolean>;
  findByIdWithRoleAccess(id: string): Promise<User>;
  updatePassword(id: string, password: string): Promise<User>;
}
