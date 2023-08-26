import { AccessPermissionRepository } from "@/domain/service/access-permission-repository";
import { AccessPermission } from "@/infrastructure/database/models";
import { AccessPermission as EntityAccess, IAccessPermission } from "@/domain/models/access_permission";
import { injectable } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";

@injectable()
export class AccessPermissionSequelizeReporsitory implements AccessPermissionRepository {
  async store(accessPermission: EntityAccess): Promise<EntityAccess> {
    try {
      const access_permission = await AccessPermission.create({
        id: accessPermission.id,
        status: false,
        isDisabled: false,
        roleId: accessPermission.roleId,
        accessId: accessPermission.accessId,
        permissionId: accessPermission.permissionId,
      });
      const entity = EntityAccess.create({
        id: access_permission.id,
        status: false,
        isDisabled: false,
        roleId: access_permission.roleId,
        accessId: access_permission.accessId,
        permissionId: access_permission.permissionId,
      });
      return entity;
    } catch (error) {
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Failed to create user",
        error,
      });
    }
  }
}
