import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import { Router } from "express";
import { injectable } from "inversify";
import multer from "multer";
import UserController from "@/presentation/controllers/web-admin/user-controller";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { PermissionList } from "@/domain/models/permission";
import { AccessList } from "@/domain/models/access";

const tmpUploadedFiles = multer({
    dest: "tmp_uploaded_files/user",
});

@injectable()
export class UserRoutes {
    UserControllerInstance = container.get<UserController>(UserController);
    MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    VerifyAccessMiddlewareInstance = container.get<VerifyAccessMiddleware>(VerifyAccessMiddleware);

    public router = Router();

    constructor() {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.get(
            "/",
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.USER, permission: PermissionList.READ }),
            asyncWrap(this.UserControllerInstance.getDataTable.bind(this.UserControllerInstance))
        );

        this.router.get(
            "/:id",
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.USER, permission: PermissionList.READ }),
            asyncWrap(this.UserControllerInstance.findUserById.bind(this.UserControllerInstance))
        );

        this.router.put(
            "/:id",
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.USER, permission: PermissionList.UPDATE }),
            tmpUploadedFiles.single("photoUrl"),
            asyncWrap(this.UserControllerInstance.updateUser.bind(this.UserControllerInstance))
        );

        this.router.put(
            "/:id/change-password",
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.USER, permission: PermissionList.UPDATE }),
            asyncWrap(this.UserControllerInstance.changePassword.bind(this.UserControllerInstance))
        );

        this.router.post(
            "/",
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.USER, permission: PermissionList.CREATE }),
            tmpUploadedFiles.single("photoUrl"),
            asyncWrap(this.UserControllerInstance.createUser.bind(this.UserControllerInstance))
        );

        this.router.delete(
            "/:id",
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.USER, permission: PermissionList.DELETE }),
            asyncWrap(this.UserControllerInstance.deleteUser.bind(this.UserControllerInstance))
        );
    }
}
