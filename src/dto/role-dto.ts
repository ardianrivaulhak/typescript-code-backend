import { IAccessData, IAccessPermissionDto } from "./access-dto";

export interface IRoleData {
  id?: string;
  name: string;
}
export interface IRoleAccessData {
  id?: string;
  name: string;
  accesses?: IAccessPermissionDto[];
}
