import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import ShiftsController from "@/presentation/controllers/web-admin/shifts-controller";
import { Router } from "express";
import { injectable } from "inversify";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { AccessList } from "@/domain/models/access";
import { PermissionList } from "@/domain/models/permission";
import multer from "multer";

const upload = multer();
@injectable()
export class ShiftsRoutes {
    public router = Router();

    ShiftsControllerInstance = container.get<ShiftsController>(ShiftsController);
    MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    VerifyAccessMiddlewareInstance = container.get<VerifyAccessMiddleware>(VerifyAccessMiddleware);
    constructor() {
        this.setRoutes();
    }
    public setRoutes() {
        this.router.get(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.SHIFT, permission: PermissionList.READ }),
            asyncWrap(this.ShiftsControllerInstance.getDataTable.bind(this.ShiftsControllerInstance))
        );
        this.router.get(
            `/v2`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.SHIFT, permission: PermissionList.READ }),
            asyncWrap(this.ShiftsControllerInstance.pagination.bind(this.ShiftsControllerInstance))
        );

        this.router.get(
            `/excel`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.SHIFT, permission: PermissionList.READ }),
            asyncWrap(this.ShiftsControllerInstance.listShifts.bind(this.ShiftsControllerInstance))
        );

        this.router.get(
            `/:shifts_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.SHIFT, permission: PermissionList.READ }),
            asyncWrap(this.ShiftsControllerInstance.ShiftsById.bind(this.ShiftsControllerInstance))
        );
        this.router.post(
            `/import`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.DATA_DEFECT, permission: PermissionList.CREATE }),
            upload.single("file"),
            asyncWrap(this.ShiftsControllerInstance.import.bind(this.ShiftsControllerInstance))
        );
        this.router.post(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.SHIFT, permission: PermissionList.CREATE }),
            asyncWrap(this.ShiftsControllerInstance.createShifts.bind(this.ShiftsControllerInstance))
        );

        this.router.put(
            `/:shifts_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.SHIFT, permission: PermissionList.UPDATE }),
            asyncWrap(this.ShiftsControllerInstance.updateShifts.bind(this.ShiftsControllerInstance))
        );

        this.router.delete(
            `/:shifts_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.SHIFT, permission: PermissionList.DELETE }),
            asyncWrap(this.ShiftsControllerInstance.destroyShifts.bind(this.ShiftsControllerInstance))
        );
    }
}
