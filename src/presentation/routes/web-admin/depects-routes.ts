import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import DepectsController from "@/presentation/controllers/web-admin/depects-controller";
import { Router } from "express";
import { injectable } from "inversify";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { PermissionList } from "@/domain/models/permission";
import { AccessList } from "@/domain/models/access";
import multer from "multer";

const upload = multer();

@injectable()
export class DepectsRoutes {
    public router = Router();
    DepectsControllerInstance = container.get<DepectsController>(DepectsController);
    MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    VerifyAccessMiddlewareInstance = container.get<VerifyAccessMiddleware>(VerifyAccessMiddleware);
    constructor() {
        this.setRoutes();
    }
    public setRoutes() {
        this.router.get(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.DATA_DEFECT, permission: PermissionList.READ }),
            asyncWrap(this.DepectsControllerInstance.getDataTable.bind(this.DepectsControllerInstance))
        );
        this.router.get(
            `/v2`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.DATA_DEFECT, permission: PermissionList.READ }),
            asyncWrap(this.DepectsControllerInstance.pagination.bind(this.DepectsControllerInstance))
        );

        this.router.post(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.DATA_DEFECT, permission: PermissionList.CREATE }),
            asyncWrap(this.DepectsControllerInstance.createDepects.bind(this.DepectsControllerInstance))
        );
        this.router.get(
            `/excel`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.DATA_DEFECT, permission: PermissionList.READ }),
            asyncWrap(this.DepectsControllerInstance.listDefects.bind(this.DepectsControllerInstance))
        );

        this.router.post(
            `/import`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.DATA_DEFECT, permission: PermissionList.CREATE }),
            upload.single("file"),
            asyncWrap(this.DepectsControllerInstance.import.bind(this.DepectsControllerInstance))
        );
        this.router.get(
            `/:depects_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.DATA_DEFECT, permission: PermissionList.READ }),
            asyncWrap(this.DepectsControllerInstance.depectsById.bind(this.DepectsControllerInstance))
        );
        this.router.put(
            `/:depects_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.DATA_DEFECT, permission: PermissionList.UPDATE }),
            asyncWrap(this.DepectsControllerInstance.updateDepects.bind(this.DepectsControllerInstance))
        );

        this.router.delete(
            `/:depects_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.DATA_DEFECT, permission: PermissionList.DELETE }),
            asyncWrap(this.DepectsControllerInstance.destroyDepects.bind(this.DepectsControllerInstance))
        );
    }
}
