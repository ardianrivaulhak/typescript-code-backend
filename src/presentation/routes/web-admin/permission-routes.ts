import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import PermissionController from "@/presentation/controllers/web-admin/permission-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class PermissionRoutes {
  public router = Router();
  PermissionControllerInstance = container.get<PermissionController>(PermissionController);
  MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);

  constructor() {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.post("/", asyncWrap(this.PermissionControllerInstance.createPermission.bind(this.PermissionControllerInstance)));
    this.router.get("/", asyncWrap(this.PermissionControllerInstance.getDataTable.bind(this.PermissionControllerInstance)));
    this.router.get("/:id", asyncWrap(this.PermissionControllerInstance.findPermissionById.bind(this.PermissionControllerInstance)));
    this.router.put("/:id", asyncWrap(this.PermissionControllerInstance.updatePermission.bind(this.PermissionControllerInstance)));
    this.router.delete("/:id", asyncWrap(this.PermissionControllerInstance.deletePermission.bind(this.PermissionControllerInstance)));
  }
}
