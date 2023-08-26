import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import MethodController from "@/presentation/controllers/web-admin/method-controller";
import { Router } from "express";
import { injectable } from "inversify";
import multer from "multer";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { AccessList } from "@/domain/models/access";
import { PermissionList } from "@/domain/models/permission";

const tmpUploadedFiles = multer({
    dest: "tmp_uploaded_files/method",
});

const upload = multer();

@injectable()
export class MethodRoutes {
    public router = Router();
    MethodControllerInstance = container.get<MethodController>(MethodController);
    MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    VerifyAccessMiddlewareInstance = container.get<VerifyAccessMiddleware>(VerifyAccessMiddleware);

    constructor() {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.get(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.METHOD, permission: PermissionList.READ }),
            asyncWrap(this.MethodControllerInstance.getDataTable.bind(this.MethodControllerInstance))
        );
        this.router.get(
            `/v2`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.METHOD, permission: PermissionList.READ }),
            asyncWrap(this.MethodControllerInstance.pagination.bind(this.MethodControllerInstance))
        );
        this.router.get(
            `/excel`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.METHOD, permission: PermissionList.READ }),
            asyncWrap(this.MethodControllerInstance.listMethods.bind(this.MethodControllerInstance))
        );
        this.router.post(
            `/import`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.METHOD, permission: PermissionList.READ }),
            upload.single("file"),
            asyncWrap(this.MethodControllerInstance.import.bind(this.MethodControllerInstance))
        );
        this.router.post(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.METHOD, permission: PermissionList.CREATE }),
            tmpUploadedFiles.single("file_url"),
            asyncWrap(this.MethodControllerInstance.createMethod.bind(this.MethodControllerInstance))
        );

        this.router.get(
            `/list-method-for-params`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            asyncWrap(this.MethodControllerInstance.listMethodForParam.bind(this.MethodControllerInstance))
        );
        this.router.get(
            `/:method_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.METHOD, permission: PermissionList.READ }),
            asyncWrap(this.MethodControllerInstance.methodById.bind(this.MethodControllerInstance))
        );
        this.router.put(
            `/:method_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.METHOD, permission: PermissionList.UPDATE }),
            tmpUploadedFiles.single("file_url"),
            asyncWrap(this.MethodControllerInstance.updateMethod.bind(this.MethodControllerInstance))
        );
        this.router.delete(
            `/:method_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.METHOD, permission: PermissionList.DELETE }),
            asyncWrap(this.MethodControllerInstance.destroyMethod.bind(this.MethodControllerInstance))
        );
    }
}
