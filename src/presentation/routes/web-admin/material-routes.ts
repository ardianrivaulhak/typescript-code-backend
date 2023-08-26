import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import MaterialController from "@/presentation/controllers/web-admin/material-controller";
import { Router } from "express";
import { injectable } from "inversify";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { AccessList } from "@/domain/models/access";
import { PermissionList } from "@/domain/models/permission";
import multer from "multer";

const upload = multer();
@injectable()
export class MaterialRoutes {
    public router = Router();
    MaterialControllerInstance = container.get<MaterialController>(MaterialController);
    MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    VerifyAccessMiddlewareInstance = container.get<VerifyAccessMiddleware>(VerifyAccessMiddleware);
    constructor() {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.get(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MATERIAL, permission: PermissionList.READ }),
            asyncWrap(this.MaterialControllerInstance.getDataTable.bind(this.MaterialControllerInstance))
        );
        this.router.get(
            `/v2`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MATERIAL, permission: PermissionList.READ }),
            asyncWrap(this.MaterialControllerInstance.pagination.bind(this.MaterialControllerInstance))
        );
        this.router.post(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MATERIAL, permission: PermissionList.CREATE }),
            asyncWrap(this.MaterialControllerInstance.store.bind(this.MaterialControllerInstance))
        );
        this.router.get(
            `/excel`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MATERIAL, permission: PermissionList.CREATE }),
            asyncWrap(this.MaterialControllerInstance.findAll.bind(this.MaterialControllerInstance))
        );
        this.router.post(
            `/import`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MATERIAL, permission: PermissionList.CREATE }),
            upload.single("file"),
            asyncWrap(this.MaterialControllerInstance.import.bind(this.MaterialControllerInstance))
        );
        this.router.get(
            `/:material_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MATERIAL, permission: PermissionList.READ }),
            asyncWrap(this.MaterialControllerInstance.getById.bind(this.MaterialControllerInstance))
        );
        this.router.put(
            `/:material_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MATERIAL, permission: PermissionList.UPDATE }),
            asyncWrap(this.MaterialControllerInstance.update.bind(this.MaterialControllerInstance))
        );
        this.router.delete(
            `/:material_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MATERIAL, permission: PermissionList.DELETE }),
            asyncWrap(this.MaterialControllerInstance.destroy.bind(this.MaterialControllerInstance))
        );
    }
}
