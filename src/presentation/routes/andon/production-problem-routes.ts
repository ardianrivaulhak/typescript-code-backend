import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import ProductionProblemController from "@/presentation/controllers/andon/production-problem-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyProductionOrderMiddleware } from "@/presentation/middleware/verify-production-order-middleware";
import { VerifyTaskMiddleware } from "@/presentation/middleware/verify-task-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class productionProblemRoutes {
    public router = Router();
    ProductionProblemControllerInstance = container.get<ProductionProblemController>(ProductionProblemController);
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
            asyncWrap(this.ProductionProblemControllerInstance.getByPOId.bind(this.ProductionProblemControllerInstance))
        );
        this.router.post(
            "/",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            this.POMiddleware.haveProductionOrder(),
            asyncWrap(this.ProductionProblemControllerInstance.add.bind(this.ProductionProblemControllerInstance))
        );
    }
}
