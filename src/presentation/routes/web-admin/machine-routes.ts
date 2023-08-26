import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import MachineController from "@/presentation/controllers/web-admin/machine-controller";
import { Router } from "express";
import { injectable } from "inversify";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { AccessList } from "@/domain/models/access";
import { PermissionList } from "@/domain/models/permission";
import multer from "multer";
const upload = multer();

@injectable()
export class MachineRoutes {
    public router = Router();
    MachineControllerInstance = container.get<MachineController>(MachineController);
    MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    VerifyAccessMiddlewareInstance = container.get<VerifyAccessMiddleware>(VerifyAccessMiddleware);
    constructor() {
        this.setRoutes();
    }
    public setRoutes() {
        this.router.get(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MACHINE, permission: PermissionList.READ }),
            asyncWrap(this.MachineControllerInstance.getDataTable.bind(this.MachineControllerInstance))
        );
        this.router.get(
            `/v2`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MACHINE, permission: PermissionList.READ }),
            asyncWrap(this.MachineControllerInstance.pagination.bind(this.MachineControllerInstance))
        );
        this.router.post(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MACHINE, permission: PermissionList.CREATE }),
            asyncWrap(this.MachineControllerInstance.createMachine.bind(this.MachineControllerInstance))
        );
        this.router.get(
            `/excel`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MACHINE, permission: PermissionList.READ }),
            asyncWrap(this.MachineControllerInstance.listMachine.bind(this.MachineControllerInstance))
        );
        this.router.post(
            `/import`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MACHINE, permission: PermissionList.READ }),
            upload.single("file"),
            asyncWrap(this.MachineControllerInstance.import.bind(this.MachineControllerInstance))
        );
        this.router.get(
            `/list-machine-for-params`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            asyncWrap(this.MachineControllerInstance.listMachineForParam.bind(this.MachineControllerInstance))
        );
        this.router.get(
            `/:machine_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MACHINE, permission: PermissionList.READ }),
            asyncWrap(this.MachineControllerInstance.machineById.bind(this.MachineControllerInstance))
        );
        this.router.put(
            `/:machine_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MACHINE, permission: PermissionList.UPDATE }),
            asyncWrap(this.MachineControllerInstance.updateMachine.bind(this.MachineControllerInstance))
        );
        this.router.delete(
            `/:machine_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.MACHINE, permission: PermissionList.DELETE }),
            asyncWrap(this.MachineControllerInstance.destroyMachine.bind(this.MachineControllerInstance))
        );
    }
}
