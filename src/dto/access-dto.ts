import { IPermissionStatusData } from "./permission-dto";

export interface IAccessData {
  id?: string;
  name?: string;
  checked?: boolean | undefined;
  children?: IAccessData[] | undefined;
}

export interface IAccessPermissionDto {
  id?: string;
  name?: string;
  parentId?: string | null | undefined;
  permissions?: IPermissionStatusData[] | undefined;
  children?: IAccessPermissionDto[] | undefined;
}
