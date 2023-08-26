import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import PreparationController from "@/presentation/controllers/andon/preparation-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyProductionOrderMiddleware } from "@/presentation/middleware/verify-production-order-middleware";
import { VerifyTaskMiddleware } from "@/presentation/middleware/verify-task-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class preparationRoutes {
    public router = Router();
    PreparationControllerInstance = container.get<PreparationController>(PreparationController);
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
            asyncWrap(this.PreparationControllerInstance.getSelectionPO.bind(this.PreparationControllerInstance))
        );

        this.router.post(
            "/:productionOrderId",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            asyncWrap(this.PreparationControllerInstance.startPreparation.bind(this.PreparationControllerInstance))
        );
    }
}
