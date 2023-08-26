import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import LineController from "@/presentation/controllers/web-admin/line-controller";
import { Router } from "express";
import { injectable } from "inversify";
import multer from "multer";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { AccessList } from "@/domain/models/access";
import { PermissionList } from "@/domain/models/permission";

const upload = multer();
const tmpUploadedFiles = multer({
    dest: "tmp_uploaded_files/line",
});
@injectable()
export class LineRoutes {
    public router = Router();
    LineControllerInstance = container.get<LineController>(LineController);
    MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    VerifyAccessMiddlewareInstance = container.get<VerifyAccessMiddleware>(VerifyAccessMiddleware);
    constructor() {
        this.setRoutes();
    }
    public setRoutes() {
        this.router.get(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.LINE, permission: PermissionList.READ }),
            asyncWrap(this.LineControllerInstance.getDataTable.bind(this.LineControllerInstance))
        );
        this.router.get(
            `/v2`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.LINE, permission: PermissionList.READ }),
            asyncWrap(this.LineControllerInstance.pagination.bind(this.LineControllerInstance))
        );
        this.router.post(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.LINE, permission: PermissionList.CREATE }),
            asyncWrap(this.LineControllerInstance.createline.bind(this.LineControllerInstance))
        );
        this.router.get(
            `/excel`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.LINE, permission: PermissionList.CREATE }),
            asyncWrap(this.LineControllerInstance.listLines.bind(this.LineControllerInstance))
        );
        this.router.post(
            `/import`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.LINE, permission: PermissionList.CREATE }),
            upload.single("file"),
            asyncWrap(this.LineControllerInstance.import.bind(this.LineControllerInstance))
        );

        this.router.get(
            `/list-line-for-params`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            asyncWrap(this.LineControllerInstance.listLineForParam.bind(this.LineControllerInstance))
        );
        this.router.post(
            `/:line_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.LINE, permission: PermissionList.UPDATE }),
            tmpUploadedFiles.single("layout_url"),
            asyncWrap(this.LineControllerInstance.createLayoutLine.bind(this.LineControllerInstance))
        );

        this.router.get(
            `/:line_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.LINE, permission: PermissionList.READ }),
            asyncWrap(this.LineControllerInstance.lineById.bind(this.LineControllerInstance))
        );
        this.router.put(
            `/:line_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.LINE, permission: PermissionList.UPDATE }),
            asyncWrap(this.LineControllerInstance.updateline.bind(this.LineControllerInstance))
        );
        this.router.delete(
            `/:line_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.LINE, permission: PermissionList.DELETE }),
            asyncWrap(this.LineControllerInstance.destroyline.bind(this.LineControllerInstance))
        );
        
    }
}
