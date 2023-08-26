import { container } from "@/container";
import { AccessList } from "@/domain/models/access";
import { PermissionList } from "@/domain/models/permission";
import asyncWrap from "@/libs/asyncWrapper";
import ScheduleController from "@/presentation/controllers/web-admin/schedule-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class ScheduleRoutes {
    public router = Router();
    ScheduleControllerInstance = container.get<ScheduleController>(ScheduleController);
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
            asyncWrap(this.ScheduleControllerInstance.create.bind(this.ScheduleControllerInstance))
        );
        this.router.get(
            "/",
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.ACCESS, permission: PermissionList.READ }),
            asyncWrap(this.ScheduleControllerInstance.getDataTable.bind(this.ScheduleControllerInstance))
        );
        this.router.get(
            "/:id",
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.ACCESS, permission: PermissionList.READ }),
            asyncWrap(this.ScheduleControllerInstance.findById.bind(this.ScheduleControllerInstance))
        );
        this.router.put(
            "/:id",
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.ACCESS, permission: PermissionList.UPDATE }),
            asyncWrap(this.ScheduleControllerInstance.update.bind(this.ScheduleControllerInstance))
        );
        this.router.delete(
            "/:id",
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.ACCESS, permission: PermissionList.DELETE }),
            asyncWrap(this.ScheduleControllerInstance.delete.bind(this.ScheduleControllerInstance))
        );
    }
}
