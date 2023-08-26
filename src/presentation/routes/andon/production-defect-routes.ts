import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import ProductionDefectController from "@/presentation/controllers/andon/production-defect-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyProductionOrderMiddleware } from "@/presentation/middleware/verify-production-order-middleware";
import { VerifyTaskMiddleware } from "@/presentation/middleware/verify-task-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class productionDefectRoutes {
    public router = Router();
    ProductionDefectControllerInstance = container.get<ProductionDefectController>(ProductionDefectController);
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
            asyncWrap(this.ProductionDefectControllerInstance.getByPOId.bind(this.ProductionDefectControllerInstance))
        );
        this.router.post(
            "/",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            this.POMiddleware.haveProductionOrder(),
            asyncWrap(this.ProductionDefectControllerInstance.add.bind(this.ProductionDefectControllerInstance))
        );
        this.router.delete(
            "/:productionDefectId",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            asyncWrap(this.ProductionDefectControllerInstance.destroy.bind(this.ProductionDefectControllerInstance))
        );
    }
}
