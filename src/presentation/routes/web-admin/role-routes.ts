import { container } from "@/container";
import { AccessList } from "@/domain/models/access";
import { PermissionList } from "@/domain/models/permission";
import asyncWrap from "@/libs/asyncWrapper";
import RoleController from "@/presentation/controllers/web-admin/role-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class RolesRoutes {
  public router = Router();
  RoleControllerInstance = container.get<RoleController>(RoleController);
  MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
  VerifyAccessMiddlewareInstance = container.get<VerifyAccessMiddleware>(VerifyAccessMiddleware);

  constructor() {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.post(
      "/",
      this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
      this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.ACCESS, permission: PermissionList.CREATE }),
      asyncWrap(this.RoleControllerInstance.createRole.bind(this.RoleControllerInstance))
    );
    this.router.get(
      "/",
      this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
      this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.ACCESS, permission: PermissionList.READ }),
      asyncWrap(this.RoleControllerInstance.getDataTable.bind(this.RoleControllerInstance))
    );
    this.router.get(
      "/:id",
      this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
      this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.ACCESS, permission: PermissionList.READ }),
      asyncWrap(this.RoleControllerInstance.findRoleById.bind(this.RoleControllerInstance))
    );
    this.router.put(
      "/:id",
      this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
      this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.ACCESS, permission: PermissionList.UPDATE }),
      asyncWrap(this.RoleControllerInstance.updateRole.bind(this.RoleControllerInstance))
    );
    this.router.delete(
      "/:id",
      this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
      this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.ACCESS, permission: PermissionList.DELETE }),
      asyncWrap(this.RoleControllerInstance.deleteRole.bind(this.RoleControllerInstance))
    );
    this.router.post(
      "/:id/assign-access",
      this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
      this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.ACCESS, permission: PermissionList.UPDATE }),
      asyncWrap(this.RoleControllerInstance.updateAccessAndPermission.bind(this.RoleControllerInstance))
    );
    this.router.get(
      "/:id/detail-access",
      this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
      this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.ACCESS, permission: PermissionList.READ }),
      asyncWrap(this.RoleControllerInstance.getDetailWithAccessAndPermission.bind(this.RoleControllerInstance))
    );
  }
}
