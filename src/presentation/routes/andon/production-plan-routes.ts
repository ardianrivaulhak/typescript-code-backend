import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import ProductionController from "@/presentation/controllers/andon/production-plan-controller";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyTaskMiddleware } from "@/presentation/middleware/verify-task-middleware";
import { Router } from "express";
import { injectable } from "inversify";

@injectable()
export class productionPlanRoutes {
    public router = Router();
    ProductionControllerInstance = container.get<ProductionController>(ProductionController);
    HmiAuthMiddleware = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    TaskMiddleware = container.get<VerifyTaskMiddleware>(VerifyTaskMiddleware);

    constructor() {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.get("/", asyncWrap(this.ProductionControllerInstance.findAll.bind(this.ProductionControllerInstance)));
        this.router.post(
            "/plan-start",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            asyncWrap(this.ProductionControllerInstance.start.bind(this.ProductionControllerInstance))
        );
        this.router.post(
            "/plan-finish",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            asyncWrap(this.ProductionControllerInstance.finish.bind(this.ProductionControllerInstance))
        );
        this.router.get(
            "/today-schedules",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            asyncWrap(this.ProductionControllerInstance.getTodaySchedule.bind(this.ProductionControllerInstance))
        );
        this.router.post(
            "/manual-po",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            asyncWrap(this.ProductionControllerInstance.createManualPO.bind(this.ProductionControllerInstance))
        );
        this.router.post(
            "/po",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            asyncWrap(this.ProductionControllerInstance.createPO.bind(this.ProductionControllerInstance))
        );
        this.router.get(
            "/listed-equipment",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            asyncWrap(this.ProductionControllerInstance.getListedEquipment.bind(this.ProductionControllerInstance))
        );

        this.router.get(
            "/unlisted-equipment",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            asyncWrap(this.ProductionControllerInstance.getUnListedEquipment.bind(this.ProductionControllerInstance))
        );

        this.router.post(
            "/set-equipment",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            asyncWrap(this.ProductionControllerInstance.setEquipment.bind(this.ProductionControllerInstance))
        );

        this.router.get(
            "/listed-manpower",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            asyncWrap(this.ProductionControllerInstance.getListedManpower.bind(this.ProductionControllerInstance))
        );

        this.router.get(
            "/unlisted-manpower",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            asyncWrap(this.ProductionControllerInstance.getListedManpower.bind(this.ProductionControllerInstance))
        );

        this.router.post(
            "/set-manpower",
            this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
            this.TaskMiddleware.haveTask(),
            asyncWrap(this.ProductionControllerInstance.setManpowers.bind(this.ProductionControllerInstance))
        );
    }
}
