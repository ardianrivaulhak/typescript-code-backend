import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import PartController from "@/presentation/controllers/web-admin/part-controller";
import { Router } from "express";
import { injectable } from "inversify";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { AccessList } from "@/domain/models/access";
import { PermissionList } from "@/domain/models/permission";
import multer from "multer";

const upload = multer();
@injectable()
export class PartRoutes {
    public router = Router();
    PartControllerInstance = container.get<PartController>(PartController);
    MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    VerifyAccessMiddlewareInstance = container.get<VerifyAccessMiddleware>(VerifyAccessMiddleware);
    constructor() {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.get(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PART, permission: PermissionList.READ }),
            asyncWrap(this.PartControllerInstance.getDataTable.bind(this.PartControllerInstance))
        );
        this.router.get(
            `/v2`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PART, permission: PermissionList.READ }),
            asyncWrap(this.PartControllerInstance.pagination.bind(this.PartControllerInstance))
        );
        this.router.post(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PART, permission: PermissionList.CREATE }),
            asyncWrap(this.PartControllerInstance.store.bind(this.PartControllerInstance))
        );

        this.router.get(
            `/excel`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PART, permission: PermissionList.CREATE }),
            asyncWrap(this.PartControllerInstance.findAlll.bind(this.PartControllerInstance))
        );
        this.router.post(
            `/import`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PART, permission: PermissionList.CREATE }),
            upload.single("file"),
            asyncWrap(this.PartControllerInstance.import.bind(this.PartControllerInstance))
        );
        this.router.get(
            `/:part_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PART, permission: PermissionList.READ }),
            asyncWrap(this.PartControllerInstance.getById.bind(this.PartControllerInstance))
        );
        this.router.put(
            `/:part_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PART, permission: PermissionList.UPDATE }),
            asyncWrap(this.PartControllerInstance.update.bind(this.PartControllerInstance))
        );
        this.router.delete(
            `/:part_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PART, permission: PermissionList.DELETE }),
            asyncWrap(this.PartControllerInstance.destroy.bind(this.PartControllerInstance))
        );
    }
}
