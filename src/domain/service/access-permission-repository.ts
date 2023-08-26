import { AccessPermission, IAccessPermission } from "../models/access_permission";

export interface AccessPermissionRepository {
  store(accessPermission: IAccessPermission): Promise<IAccessPermission>;
}
