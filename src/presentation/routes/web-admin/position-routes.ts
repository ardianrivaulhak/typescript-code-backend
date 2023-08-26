import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import PositionController from "@/presentation/controllers/web-admin/position-controller";
import { Router } from "express";
import { injectable } from "inversify";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";


@injectable()
export class PositionRoutes {
    public router = Router();
    PositionControllerInstance = container.get<PositionController>(PositionController);
    MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    constructor() {
        this.setRoutes();
    }
    public setRoutes() {
        this.router.get(`/`,
        this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
        asyncWrap(this.PositionControllerInstance.getDataTable.bind(this.PositionControllerInstance)));

        this.router.post(`/`, 
        this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
        asyncWrap(this.PositionControllerInstance.store.bind(this.PositionControllerInstance)));
        
        this.router.get(`/excel`, 
        this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
        asyncWrap(this.PositionControllerInstance.findAll.bind(this.PositionControllerInstance)));

        this.router.get(`/list-position-for-params`, 
        this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
        asyncWrap(this.PositionControllerInstance.listPositionForParam.bind(this.PositionControllerInstance)));
        
        this.router.get(`/:position_id`, 
        this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
        asyncWrap(this.PositionControllerInstance.getById.bind(this.PositionControllerInstance)));
        
        this.router.put(`/:position_id`,
        this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
        asyncWrap(this.PositionControllerInstance.update.bind(this.PositionControllerInstance)));

        this.router.delete(`/:position_id`, 
        this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
        asyncWrap(this.PositionControllerInstance.destroy.bind(this.PositionControllerInstance)));
    }
}
