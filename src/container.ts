import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

// Routes
import { Routes } from "@/presentation/routes/routes";
import { WebAdminRoutes } from "./presentation/routes/web-admin";
import { UserRoutes } from "@/presentation/routes/web-admin/user-routes";
import { WebadminAuthRoute } from "./presentation/routes/web-admin/auth-route";
import { RolesRoutes } from "./presentation/routes/web-admin/role-routes";
import { AccessRoutes } from "./presentation/routes/web-admin/access-routes";
import { PermissionRoutes } from "./presentation/routes/web-admin/permission-routes";

import { ProblemRoutes } from "@/presentation/routes/web-admin/problem-routes";
import { DepectsRoutes } from "@/presentation/routes/web-admin/depects-routes";
import { ShiftsRoutes } from "@/presentation/routes/web-admin/shifts-routes";
import { MachineRoutes } from "@/presentation/routes/web-admin/machine-routes";
import { LineRoutes } from "@/presentation/routes/web-admin/line-routes";
import { MethodRoutes } from "@/presentation/routes/web-admin/method-routes";
import { PartRoutes } from "@/presentation/routes/web-admin/part-routes";
import { EquipmentRoutes } from "@/presentation/routes/web-admin/equipment-routes";
import { MaterialRoutes } from "@/presentation/routes/web-admin/material-routes";
import { PositionRoutes } from "@/presentation/routes/web-admin/position-routes";
import { ManpowerRoutes } from "@/presentation/routes/web-admin/manpower-routes";
import { ScheduleRoutes } from "@/presentation/routes/web-admin/schedule-routes";

import { hmiRoutes } from "./presentation/routes/andon";
import { hmiAuthRoutes } from "./presentation/routes/andon/auth-hmi";
import { productionPlanRoutes } from "./presentation/routes/andon/production-plan-routes";
import { menuControlRoutes } from "./presentation/routes/andon/menu-control-routes";
import { preparationRoutes } from "./presentation/routes/andon/preparation-routes";
import { productionProblemRoutes } from "./presentation/routes/andon/production-problem-routes";
import { productionDefectRoutes } from "./presentation/routes/andon/production-defect-routes";
import { methodHMIRoutes } from "./presentation/routes/andon/method-routes";
import { productionSupportRoutes } from "./presentation/routes/andon/production-support-routes";

// Domain Repository
import { UserRepository } from "@/domain/service/user-repository";
import { ProblemRepository } from "@/domain/service/problem-repository";
import { DefectsRepository } from "@/domain/service/depects-repository";
import { ShiftsRepository } from "@/domain/service/shifts-repository";
import { RoleRepository } from "@/domain/service/role-repository";
import { AccessRepository } from "@/domain/service/access-repository";
import { MachineRepository } from "@/domain/service/machine-repository";
import { LineRepository } from "@/domain/service/line-repository";
import { MethodRepository } from "@/domain/service/method-repository";
import { PartRepository } from "@/domain/service/part-repository";
import { EquipmentRepository } from "@/domain/service/equipment-repository";
import { MaterialRepository } from "@/domain/service/material-repository";
import { PositionRepository } from "@/domain/service/position-repository";
import { ManpowerRepository } from "@/domain/service/manpower-repository";

import { PermissionRepository } from "@/domain/service/permission-repository";
import { AccessPermissionRepository } from "@/domain/service/access-permission-repository";
import { SessionLoginRepository } from "@/domain/service/session-login-repository";
import { TaskRepository } from "@/domain/service/task-repository";
import { ScheduleRepository } from "@/domain/service/schedule-repository";
import { ProductionOrderRepository } from "@/domain/service/production-order-repository";
import { ProductionEquipmentRepository } from "@/domain/service/production-equipment-repository";
import { ProductionManpowerRepository } from "@/domain/service/production-manpower-repository";
import { ProductionProblemRepository } from "@/domain/service/production-problem-repository";
import { ProductionDefectRepository } from "@/domain/service/production-defect-repository";
import { PreparationTimeLogRepository } from "@/domain/service/preparation-time-log-repository";
import { MethodLogRepository } from "@/domain/service/method-log-repository";
import { ProductionMaterialRepository } from "@/domain/service/production-material-repository";
import { MaterialChangedLogRepository } from "@/domain/service/material-changed-log-repository";

// Domain Repository / Infrastructur implementation
import { UserSequelizeRepository } from "@/persistence/repository/user-sequelize-repository";
import { RoleSequelizeReporsitory } from "@/persistence/repository/role-sequelize-repository";
import { AccessSequelizeReporsitory } from "@/persistence/repository/access-sequelize-repository";
import { PermissionSequelizeReporsitory } from "@/persistence/repository/permission-sequelize-repository";
import { AccessPermissionSequelizeReporsitory } from "@/persistence/repository/access-permission-repository";

import { ProblemSequelizeRepository } from "@/persistence/repository/problem-sequelize-repository";
import { DefectsSequelizeRepository } from "@/persistence/repository/depects-sequelize-repository";
import { ShiftsSequelizeRepository } from "@/persistence/repository/shifts-sequelize-repository";
import { MachineSequeliezeRepository } from "@/persistence/repository/machine-sequelize-repository";
import { LineSequelizeRepository } from "@/persistence/repository/line-sequelize-repository";
import { MethodSequelizeRepository } from "@/persistence/repository/method-sequelize-repository";
import { PartSequelizeReporsitory } from "@/persistence/repository/part-sequelize-repository";
import { EquipmentSequelizeRepository } from "@/persistence/repository/equipment-sequelize-repository";
import { MaterialSequelizeRepository } from "@/persistence/repository/material-sequellize-repository";
import { PositionSequelizeRepository } from "@/persistence/repository/position-sequelize-repository";
import { ManpowerSequeliezeRepository } from "@/persistence/repository/manpower-sequelice-repository";

import { TaskSequelizeRepository } from "@/persistence/repository/task-sequelize-repository";
import { ScheduleSequelizeReporsitory } from "@/persistence/repository/schedule-sequelize-repository";
import { ProductionOrderSequelizeRepository } from "@/persistence/repository/production-order-sequelize-repository";
import { ProductionEquipmentSequelizeRepository } from "@/persistence/repository/production-equipment-sequelize-repository";
import { ProductionManpowerSequelizeRepository } from "@/persistence/repository/production-manpower-sequelize-repository";
import { ProductionProblemSequelizeRepository } from "@/persistence/repository/production-problem-sequelize-repository";
import { ProductionDefectSequelizeRepository } from "@/persistence/repository/production-defect-sequelize-repository";
import { PreparationTimeLogSequelizeRepository } from "@/persistence/repository/preparation-time-log-sequelize-repository";
import { MethodLogSequelizeRepository } from "@/persistence/repository/method-log-sequelize-repository";
import { ProductionMaterialSequelizeRepository } from "@/persistence/repository/production-material-sequelize-repository";
import { MaterialChangedLogSequelizeRepository } from "@/persistence/repository/material-changed-log-sequelize-repository";

// Service Implementation
import { UserService } from "@/services/web-admin/user-service";
import { WebadminAuthService } from "./services/web-admin/auth-service";
import { RoleService } from "./services/web-admin/role-service";
import { AccessService } from "./services/web-admin/access-service";
import { hmiAuthService } from "./services/andon/auth-hmi-service";

// Controller
import UserController from "@/presentation/controllers/web-admin/user-controller";
import { WebadminAuthController } from "@/presentation/controllers/web-admin/auth-controller";
import RoleController from "@/presentation/controllers/web-admin/role-controller";
import AccessController from "@/presentation/controllers/web-admin/access-controller";
import PermissionController from "@/presentation/controllers/web-admin/permission-controller";

import ProblemController from "./presentation/controllers/web-admin/problem-controller";
import DepectsController from "./presentation/controllers/web-admin/depects-controller";
import ShiftsController from "./presentation/controllers/web-admin/shifts-controller";
import MachineController from "./presentation/controllers/web-admin/machine-controller";
import LineController from "./presentation/controllers/web-admin/line-controller";
import MethodController from "./presentation/controllers/web-admin/method-controller";
import PartController from "./presentation/controllers/web-admin/part-controller";
import EquipmentController from "./presentation/controllers/web-admin/equipment-controlle";
import MaterialController from "./presentation/controllers/web-admin/material-controller";
import PositionController from "./presentation/controllers/web-admin/position-controller";
import ManpowerController from "./presentation/controllers/web-admin/manpower-controller";
import ScheduleController from "./presentation/controllers/web-admin/schedule-controller";
import ProductionPlanController from "./presentation/controllers/andon/production-plan-controller";
import MenuController from "./presentation/controllers/andon/menu-controller";
import PreparationController from "./presentation/controllers/andon/preparation-controller";
import ProductionProblemController from "./presentation/controllers/andon/production-problem-controller";
import ProductionDefectController from "./presentation/controllers/andon/production-defect-controller";
import MethodHMIController from "./presentation/controllers/andon/method-controller";
import ProductionSupportController from "./presentation/controllers/andon/production-support-controller";

//Middleware
import { MobileAuthMiddleware } from "./presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "./presentation/middleware/verify-access-middleware";
import { VerifyTaskMiddleware } from "./presentation/middleware/verify-task-middleware";
import { VerifyPOMiddleware } from "./presentation/middleware/verify-po-middleware";
import { VerifyProductionOrderMiddleware } from "./presentation/middleware/verify-production-order-middleware";

// Bootstrap / kernel
import { IServer, Server } from "@/presentation/server";
import { PermissionService } from "./services/web-admin/permission-service";
import { LineService } from "./services/web-admin/line-service";
import { ProblemService } from "./services/web-admin/problem-service";
import { ShiftsService } from "./services/web-admin/shifts-service";
import { DefectsService } from "./services/web-admin/depects-service";
import { MachineService } from "./services/web-admin/machine-service";
import { MethodService } from "./services/web-admin/method-service";
import { PartService } from "./services/web-admin/part-service";
import { EquipmentService } from "./services/web-admin/equipment-service";
import { MaterialService } from "./services/web-admin/material-service";
import { PositionService } from "./services/web-admin/position-service";
import { ManpowerService } from "./services/web-admin/manpower-service";
import { ProductionPlanService } from "./services/andon/production-plan-service";
import { ScheduleService } from "./services/web-admin/schedule-service";
import { HmiAuthController } from "./presentation/controllers/andon/auth-controller";
import { SessionLoginSequelizeRepository } from "./persistence/repository/session-login-sequelize-repository";
import { sessionLoginService } from "./services/andon/session-login-service";
import { MenuControlService } from "./services/andon/menu-control-service";
import { PreparationService } from "./services/andon/preparation-service";
import { ProductionProblemService } from "./services/andon/production-problem-service";
import { ProductionDefectService } from "./services/andon/production-defect-service";
import { MethodHmiService } from "./services/andon/method-service";
import { ProductionSupportService } from "./services/andon/production-support-service";

const container = new Container();

// Kernel Bootstrap
container.bind<IServer>(TYPES.Server).to(Server).inSingletonScope();

// Router
container.bind<Routes>(Routes).toSelf().inSingletonScope();
container.bind<WebAdminRoutes>(WebAdminRoutes).toSelf().inSingletonScope();
container.bind<UserRoutes>(UserRoutes).toSelf().inSingletonScope();
container.bind<WebadminAuthRoute>(WebadminAuthRoute).toSelf().inSingletonScope();
container.bind<ProblemRoutes>(ProblemRoutes).toSelf().inSingletonScope();
container.bind<DepectsRoutes>(DepectsRoutes).toSelf().inSingletonScope();
container.bind<ShiftsRoutes>(ShiftsRoutes).toSelf().inSingletonScope();
container.bind<RolesRoutes>(RolesRoutes).toSelf().inSingletonScope();
container.bind<AccessRoutes>(AccessRoutes).toSelf().inSingletonScope();
container.bind<PermissionRoutes>(PermissionRoutes).toSelf().inSingletonScope();
container.bind<LineRoutes>(LineRoutes).toSelf().inSingletonScope();
container.bind<MachineRoutes>(MachineRoutes).toSelf().inSingletonScope();
container.bind<MethodRoutes>(MethodRoutes).toSelf().inSingletonScope();
container.bind<PartRoutes>(PartRoutes).toSelf().inSingletonScope();
container.bind<EquipmentRoutes>(EquipmentRoutes).toSelf().inSingletonScope();
container.bind<MaterialRoutes>(MaterialRoutes).toSelf().inSingletonScope();
container.bind<PositionRoutes>(PositionRoutes).toSelf().inSingletonScope();
container.bind<ManpowerRoutes>(ManpowerRoutes).toSelf().inSingletonScope();
container.bind<ScheduleRoutes>(ScheduleRoutes).toSelf().inSingletonScope();

container.bind<hmiRoutes>(hmiRoutes).toSelf().inSingletonScope();
container.bind<hmiAuthRoutes>(hmiAuthRoutes).toSelf().inSingletonScope();
container.bind<productionPlanRoutes>(productionPlanRoutes).toSelf().inSingletonScope();
container.bind<menuControlRoutes>(menuControlRoutes).toSelf().inSingletonScope();
container.bind<preparationRoutes>(preparationRoutes).toSelf().inSingletonScope();
container.bind<productionProblemRoutes>(productionProblemRoutes).toSelf().inSingletonScope();
container.bind<productionDefectRoutes>(productionDefectRoutes).toSelf().inSingletonScope();
container.bind<methodHMIRoutes>(methodHMIRoutes).toSelf().inSingletonScope();
container.bind<productionSupportRoutes>(productionSupportRoutes).toSelf().inSingletonScope();

// Service Layer
// Mobile Service

// Web Admin Service
container.bind(TYPES.WebadminAuthService).to(WebadminAuthService);
container.bind(TYPES.UserService).to(UserService);
container.bind(TYPES.RoleService).to(RoleService);
container.bind(TYPES.AccessService).to(AccessService);
container.bind(TYPES.PermissionService).to(PermissionService);
container.bind(TYPES.LineService).to(LineService);
container.bind(TYPES.ProblemServince).to(ProblemService);
container.bind(TYPES.ShiftsService).to(ShiftsService);
container.bind(TYPES.DepectsService).to(DefectsService);
container.bind(TYPES.MachineService).to(MachineService);
container.bind(TYPES.MethodService).to(MethodService);
container.bind(TYPES.PartService).to(PartService);
container.bind(TYPES.EquipmentService).to(EquipmentService);
container.bind(TYPES.MaterialService).to(MaterialService);
container.bind(TYPES.PositionService).to(PositionService);
container.bind(TYPES.ManpowerService).to(ManpowerService);
container.bind(TYPES.hmiAuthService).to(hmiAuthService);
container.bind(TYPES.sessionLoginService).to(sessionLoginService);
container.bind(TYPES.ProductionPlanService).to(ProductionPlanService);
container.bind(TYPES.ScheduleService).to(ScheduleService);
container.bind(TYPES.MenuControlService).to(MenuControlService);
container.bind(TYPES.PreparationService).to(PreparationService);
container.bind(TYPES.ProductionProblemService).to(ProductionProblemService);
container.bind(TYPES.ProductionDefectService).to(ProductionDefectService);
container.bind(TYPES.MethodHmiService).to(MethodHmiService);
container.bind(TYPES.ProductionSupportService).to(ProductionSupportService);
// Web Admin Controller
container.bind(UserController).toSelf();
container.bind(WebadminAuthController).toSelf();
container.bind(RoleController).toSelf();
container.bind(AccessController).toSelf();
container.bind(PermissionController).toSelf();
container.bind(DepectsController).toSelf();
container.bind(MachineController).toSelf();
container.bind(LineController).toSelf();
container.bind(ProblemController).toSelf();
container.bind(ShiftsController).toSelf();
container.bind(MethodController).toSelf();
container.bind(PartController).toSelf();
container.bind(EquipmentController).toSelf();
container.bind(MaterialController).toSelf();
container.bind(PositionController).toSelf();
container.bind(ManpowerController).toSelf();
container.bind(HmiAuthController).toSelf();
container.bind(ScheduleController).toSelf();
container.bind(MenuController).toSelf();
container.bind(PreparationController).toSelf();
container.bind(ProductionProblemController).toSelf();
container.bind(ProductionDefectController).toSelf();
container.bind(MethodHMIController).toSelf();
container.bind(ProductionSupportController).toSelf();

// undon controller

container.bind(ProductionPlanController).toSelf();
// Middleware
container.bind(MobileAuthMiddleware).toSelf();
container.bind(VerifyAccessMiddleware).toSelf();
container.bind(VerifyTaskMiddleware).toSelf();
container.bind(VerifyPOMiddleware).toSelf();
container.bind(VerifyProductionOrderMiddleware).toSelf();

// implement infrastructur
container.bind<UserRepository>(TYPES.UserRepository).to(UserSequelizeRepository);
container.bind<ProblemRepository>(TYPES.ProblemRepository).to(ProblemSequelizeRepository);
container.bind<DefectsRepository>(TYPES.DepectsRepository).to(DefectsSequelizeRepository);
container.bind<ShiftsRepository>(TYPES.ShiftsRepository).to(ShiftsSequelizeRepository);
container.bind<RoleRepository>(TYPES.RoleRepository).to(RoleSequelizeReporsitory);
container.bind<AccessRepository>(TYPES.AccessRepository).to(AccessSequelizeReporsitory);
container.bind<PermissionRepository>(TYPES.PermissionRepository).to(PermissionSequelizeReporsitory);
container.bind<AccessPermissionRepository>(TYPES.AccessPermissionRepository).to(AccessPermissionSequelizeReporsitory);
container.bind<LineRepository>(TYPES.LineRepository).to(LineSequelizeRepository);
container.bind<MachineRepository>(TYPES.MachineRepository).to(MachineSequeliezeRepository);
container.bind<MethodRepository>(TYPES.MethodRepository).to(MethodSequelizeRepository);
container.bind<PartRepository>(TYPES.PartRepository).to(PartSequelizeReporsitory);
container.bind<EquipmentRepository>(TYPES.EquipmentRepository).to(EquipmentSequelizeRepository);
container.bind<MaterialRepository>(TYPES.MaterialRepository).to(MaterialSequelizeRepository);
container.bind<PositionRepository>(TYPES.PositionRepository).to(PositionSequelizeRepository);
container.bind<ManpowerRepository>(TYPES.ManpowerRepository).to(ManpowerSequeliezeRepository);
container.bind<SessionLoginRepository>(TYPES.SessionLoginRepository).to(SessionLoginSequelizeRepository);
container.bind<TaskRepository>(TYPES.TaskRepository).to(TaskSequelizeRepository);
container.bind<ScheduleRepository>(TYPES.ScheduleRepository).to(ScheduleSequelizeReporsitory);
container.bind<ProductionOrderRepository>(TYPES.ProductionOrderRepository).to(ProductionOrderSequelizeRepository);
container.bind<ProductionEquipmentRepository>(TYPES.ProductionEquipmentRepository).to(ProductionEquipmentSequelizeRepository);
container.bind<ProductionManpowerRepository>(TYPES.ProductionManpowerRepository).to(ProductionManpowerSequelizeRepository);
container.bind<ProductionProblemRepository>(TYPES.ProductionProblemRepository).to(ProductionProblemSequelizeRepository);
container.bind<ProductionDefectRepository>(TYPES.ProductionDefectRepository).to(ProductionDefectSequelizeRepository);
container.bind<PreparationTimeLogRepository>(TYPES.PreparationTimeLogRepository).to(PreparationTimeLogSequelizeRepository);
container.bind<MethodLogRepository>(TYPES.MethodLogRepository).to(MethodLogSequelizeRepository);
container.bind<ProductionMaterialRepository>(TYPES.ProductionMaterialRepository).to(ProductionMaterialSequelizeRepository);
container.bind<MaterialChangedLogRepository>(TYPES.MaterialChangedLogRepository).to(MaterialChangedLogSequelizeRepository);
export { container };
