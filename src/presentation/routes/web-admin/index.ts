import { Router } from "express";
import { injectable } from "inversify";
import { UserRoutes } from "./user-routes";
import { WebadminAuthRoute } from "./auth-route";
import { RolesRoutes } from "./role-routes";
import { AccessRoutes } from "./access-routes";
import { PermissionRoutes } from "./permission-routes";
import { ProblemRoutes } from "./problem-routes";
import { DepectsRoutes } from "./depects-routes";
import { ShiftsRoutes } from "./shifts-routes";
import { MachineRoutes } from "./machine-routes";
import { LineRoutes } from "./line-routes";
import { MethodRoutes } from "./method-routes";
import { PartRoutes } from "./part-routes";
import { EquipmentRoutes } from "./equipment-routes";
import { MaterialRoutes } from "./material-routes";
import { PositionRoutes } from "./position-routes";
import { ManpowerRoutes } from "./manpower-routes";
import { ScheduleRoutes } from "./schedule-routes";

@injectable()
export class WebAdminRoutes {
    router = Router();
    constructor(
        private userRoutes: UserRoutes,
        private AuthRoute: WebadminAuthRoute,
        private roleRoutes: RolesRoutes,
        private accessRoutes: AccessRoutes,
        private permissionRoutes: PermissionRoutes,
        private problemRoutes: ProblemRoutes,
        private depectsRoutes: DepectsRoutes,
        private shiftsRoutes: ShiftsRoutes,
        private machineRoutes: MachineRoutes,
        private lineRoutes: LineRoutes,
        private methodRoutes: MethodRoutes,
        private partRoutes: PartRoutes,
        private equipmentRoutes: EquipmentRoutes,
        private materialRoutes: MaterialRoutes,
        private positionRoutes: PositionRoutes,
        private manpowerRoutes: ManpowerRoutes,
        private scheduleRoutes: ScheduleRoutes
    ) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.use("/user", this.userRoutes.router);
        this.router.use("/auth", this.AuthRoute.router);
        this.router.use("/role", this.roleRoutes.router);
        this.router.use("/access", this.accessRoutes.router);
        this.router.use("/permission", this.permissionRoutes.router);
        this.router.use("/problem", this.problemRoutes.router);
        this.router.use("/depects", this.depectsRoutes.router);
        this.router.use("/shifts", this.shiftsRoutes.router);
        this.router.use("/machine", this.machineRoutes.router);
        this.router.use("/line", this.lineRoutes.router);
        this.router.use("/method", this.methodRoutes.router);
        this.router.use("/part", this.partRoutes.router);
        this.router.use("/equipment", this.equipmentRoutes.router);
        this.router.use("/material", this.materialRoutes.router);
        this.router.use("/position", this.positionRoutes.router);
        this.router.use("/manpower", this.manpowerRoutes.router);
        this.router.use("/schedule", this.scheduleRoutes.router);
    }
}
