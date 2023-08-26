import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import MenuController from "@/presentation/controllers/andon/menu-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyTaskMiddleware } from "@/presentation/middleware/verify-task-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class menuControlRoutes {
    public router = Router();
    MenuControllerInstance = container.get<MenuController>(MenuController);
    HmiAuthMiddleware = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    TaskMiddleware = container.get<VerifyTaskMiddleware>(VerifyTaskMiddleware);

    constructor() {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.get(
            "/machine",
            asyncWrap(this.MenuControllerInstance.getMachineList.bind(this.MenuControllerInstance))
        );
        this.router.get(
            "/shift",
            asyncWrap(this.MenuControllerInstance.getShiftList.bind(this.MenuControllerInstance))
        );
        this.router.get(
            "/general",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            asyncWrap(this.MenuControllerInstance.getGeneral.bind(this.MenuControllerInstance))
        );
        this.router.get(
            "/production-plan",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            asyncWrap(this.MenuControllerInstance.getProductionPlan.bind(this.MenuControllerInstance))
        );
    }
}
