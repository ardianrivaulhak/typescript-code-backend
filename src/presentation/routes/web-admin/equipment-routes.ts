import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import EquipmentController from "@/presentation/controllers/web-admin/equipment-controlle";
import { Router } from "express";
import { injectable } from "inversify";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { AccessList } from "@/domain/models/access";
import { PermissionList } from "@/domain/models/permission";
import multer from "multer";

const upload = multer();

@injectable()
export class EquipmentRoutes {
    public router = Router();
    EquipmentControllerInstance = container.get<EquipmentController>(EquipmentController);
    MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    VerifyAccessMiddlewareInstance = container.get<VerifyAccessMiddleware>(VerifyAccessMiddleware);
    constructor() {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.get(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.EQUIPMENT, permission: PermissionList.READ }),
            asyncWrap(this.EquipmentControllerInstance.getDataTable.bind(this.EquipmentControllerInstance))
        );
        this.router.get(
            `/v2`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.EQUIPMENT, permission: PermissionList.READ }),
            asyncWrap(this.EquipmentControllerInstance.pagination.bind(this.EquipmentControllerInstance))
        );
        this.router.post(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.EQUIPMENT, permission: PermissionList.CREATE }),
            asyncWrap(this.EquipmentControllerInstance.store.bind(this.EquipmentControllerInstance))
        );
        this.router.get(
            `/excel`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.EQUIPMENT, permission: PermissionList.READ }),
            asyncWrap(this.EquipmentControllerInstance.findAll.bind(this.EquipmentControllerInstance))
        );
        this.router.post(
            `/import`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.EQUIPMENT, permission: PermissionList.READ }),
            upload.single("file"),
            asyncWrap(this.EquipmentControllerInstance.import.bind(this.EquipmentControllerInstance))
        );
        this.router.get(
            `/:equipment_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.EQUIPMENT, permission: PermissionList.READ }),
            asyncWrap(this.EquipmentControllerInstance.getById.bind(this.EquipmentControllerInstance))
        );
        this.router.put(
            `/:equipment_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.EQUIPMENT, permission: PermissionList.UPDATE }),
            asyncWrap(this.EquipmentControllerInstance.update.bind(this.EquipmentControllerInstance))
        );
        this.router.delete(
            `/:equipment_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.EQUIPMENT, permission: PermissionList.DELETE }),
            asyncWrap(this.EquipmentControllerInstance.destroy.bind(this.EquipmentControllerInstance))
        );
    }
}
