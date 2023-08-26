import { Router } from "express";
import { injectable } from "inversify";
import { hmiAuthRoutes } from "./auth-hmi";
import { productionPlanRoutes } from "./production-plan-routes";
import { menuControlRoutes } from "./menu-control-routes";
import { preparationRoutes } from "./preparation-routes";
import { productionProblemRoutes } from "./production-problem-routes";
import { productionDefectRoutes } from "./production-defect-routes";
import { methodHMIRoutes } from "./method-routes";
import { productionSupportRoutes } from "./production-support-routes";

@injectable()
export class hmiRoutes {
    router = Router();
    constructor(
        private authRoutes: hmiAuthRoutes,
        private productionPlanRoutes: productionPlanRoutes,
        private menuControlRoutes: menuControlRoutes,
        private preparationRoutes: preparationRoutes,
        private productionProblemRoutes: productionProblemRoutes,
        private productionDefectRoutes: productionDefectRoutes,
        private methodRoutes: methodHMIRoutes,
        private productionSupportRoutes: productionSupportRoutes

    ) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.use("/auth", this.authRoutes.router);
        this.router.use("/production-plan", this.productionPlanRoutes.router);
        this.router.use("/menu-control", this.menuControlRoutes.router);
        this.router.use("/preparation", this.preparationRoutes.router);
        this.router.use("/production-problem", this.productionProblemRoutes.router);
        this.router.use("/production-defect", this.productionDefectRoutes.router);
        this.router.use("/method", this.methodRoutes.router);
        this.router.use("/production", this.productionSupportRoutes.router);
    }
}
