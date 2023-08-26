import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import ManpowerController from "@/presentation/controllers/web-admin/manpower-controller";
import { Router } from "express";
import { injectable } from "inversify";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { AccessList } from "@/domain/models/access";
import { PermissionList } from "@/domain/models/permission";
import multer from "multer";

const upload = multer();
@injectable()
export class ManpowerRoutes {
    public router = Router();
    ManpowerControllerInstance = container.get<ManpowerController>(ManpowerController);
    MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    VerifyAccessMiddlewareInstance = container.get<VerifyAccessMiddleware>(VerifyAccessMiddleware);
    constructor() {
        this.setRoutes();
    }
    public setRoutes() {
        this.router.get(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MANPOWER, permission: PermissionList.READ }),
            asyncWrap(this.ManpowerControllerInstance.getDataTable.bind(this.ManpowerControllerInstance))
        );
        this.router.get(
            `/v2`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MANPOWER, permission: PermissionList.READ }),
            asyncWrap(this.ManpowerControllerInstance.pagination.bind(this.ManpowerControllerInstance))
        );
        this.router.post(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MANPOWER, permission: PermissionList.CREATE }),
            asyncWrap(this.ManpowerControllerInstance.store.bind(this.ManpowerControllerInstance))
        );
        this.router.get(
            `/excel`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MANPOWER, permission: PermissionList.CREATE }),
            asyncWrap(this.ManpowerControllerInstance.findAll.bind(this.ManpowerControllerInstance))
        );
        this.router.post(
            `/import`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MANPOWER, permission: PermissionList.CREATE }),
            upload.single("file"),
            asyncWrap(this.ManpowerControllerInstance.import.bind(this.ManpowerControllerInstance))
        );
        this.router.get(
            `/:manpower_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MANPOWER, permission: PermissionList.UPDATE }),
            asyncWrap(this.ManpowerControllerInstance.getById.bind(this.ManpowerControllerInstance))
        );
        this.router.put(
            `/:manpower_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MANPOWER, permission: PermissionList.UPDATE }),
            asyncWrap(this.ManpowerControllerInstance.update.bind(this.ManpowerControllerInstance))
        );
        this.router.delete(
            `/:manpower_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MANPOWER, permission: PermissionList.DELETE }),
            asyncWrap(this.ManpowerControllerInstance.destroy.bind(this.ManpowerControllerInstance))
        );
    }
}
