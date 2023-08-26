import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import AccessController from "@/presentation/controllers/web-admin/access-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class AccessRoutes {
  public router = Router();
  AccessControllerInstance = container.get<AccessController>(AccessController);
  MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);

  constructor() {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.post("/", asyncWrap(this.AccessControllerInstance.createAccess.bind(this.AccessControllerInstance)));
    this.router.get("/", asyncWrap(this.AccessControllerInstance.getDataTable.bind(this.AccessControllerInstance)));
    this.router.get("/:id", asyncWrap(this.AccessControllerInstance.findAccessById.bind(this.AccessControllerInstance)));
    this.router.put("/:id", asyncWrap(this.AccessControllerInstance.updateAccess.bind(this.AccessControllerInstance)));
    this.router.delete("/:id", asyncWrap(this.AccessControllerInstance.deleteAccess.bind(this.AccessControllerInstance)));
  }
}
