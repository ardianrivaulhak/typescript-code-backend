import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import ProductionSupportController from "@/presentation/controllers/andon/production-support-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyProductionOrderMiddleware } from "@/presentation/middleware/verify-production-order-middleware";
import { VerifyTaskMiddleware } from "@/presentation/middleware/verify-task-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class productionSupportRoutes {
    public router = Router();
    ProductionSupportControllerInstance = container.get<ProductionSupportController>(ProductionSupportController);
    HmiAuthMiddleware = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    TaskMiddleware = container.get<VerifyTaskMiddleware>(VerifyTaskMiddleware);
    POMiddleware = container.get<VerifyProductionOrderMiddleware>(VerifyProductionOrderMiddleware);

    constructor() {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.get(
            "/material",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            this.POMiddleware.haveProductionOrder(),
            asyncWrap(this.ProductionSupportControllerInstance.getMaterials.bind(this.ProductionSupportControllerInstance))
        );

        this.router.put(
            "/material",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            this.POMiddleware.haveProductionOrder(),
            asyncWrap(this.ProductionSupportControllerInstance.updateLotRemark.bind(this.ProductionSupportControllerInstance))
        );
    }
}
