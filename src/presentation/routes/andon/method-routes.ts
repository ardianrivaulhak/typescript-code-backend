import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import MethodHMIController from "@/presentation/controllers/andon/method-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyProductionOrderMiddleware } from "@/presentation/middleware/verify-production-order-middleware";
import { VerifyTaskMiddleware } from "@/presentation/middleware/verify-task-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class methodHMIRoutes {
    public router = Router();
    MethodControllerInstance = container.get<MethodHMIController>(MethodHMIController);
    HmiAuthMiddleware = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    TaskMiddleware = container.get<VerifyTaskMiddleware>(VerifyTaskMiddleware);
    POMiddleware = container.get<VerifyProductionOrderMiddleware>(VerifyProductionOrderMiddleware);

    constructor() {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.get(
            "/",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            this.POMiddleware.haveProductionOrder(),
            asyncWrap(this.MethodControllerInstance.getAll.bind(this.MethodControllerInstance))
        );

        this.router.get(
            "/logs",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            this.POMiddleware.haveProductionOrder(),
            asyncWrap(this.MethodControllerInstance.getMethodLog.bind(this.MethodControllerInstance))
        );

        this.router.post(
            "/add-remark",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            this.POMiddleware.haveProductionOrder(),
            asyncWrap(this.MethodControllerInstance.addRemark.bind(this.MethodControllerInstance))
        );
    }
}
