import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import ProblemController from "@/presentation/controllers/web-admin/problem-controller";
import { Router } from "express";
import { injectable } from "inversify";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { VerifyAccessMiddleware } from "@/presentation/middleware/verify-access-middleware";
import { AccessList } from "@/domain/models/access";
import { PermissionList } from "@/domain/models/permission";
import multer from "multer";

const upload = multer();
@injectable()
export class ProblemRoutes {
    public router = Router();
    ProblemControllerInstance = container.get<ProblemController>(ProblemController);
    MobileAuthMiddlewareInstance = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
    VerifyAccessMiddlewareInstance = container.get<VerifyAccessMiddleware>(VerifyAccessMiddleware);
    constructor() {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.get(
            `/excel`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PROBLEM, permission: PermissionList.CREATE }),
            asyncWrap(this.ProblemControllerInstance.listProblems.bind(this.ProblemControllerInstance))
        );

        this.router.post(
            `/import`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PROBLEM, permission: PermissionList.CREATE }),
            upload.single("file"),
            asyncWrap(this.ProblemControllerInstance.importProblems.bind(this.ProblemControllerInstance))
        );
        this.router.get(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PROBLEM, permission: PermissionList.READ }),
            asyncWrap(this.ProblemControllerInstance.getDataTable.bind(this.ProblemControllerInstance))
        );
        this.router.get(
            `/v2`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PROBLEM, permission: PermissionList.READ }),
            asyncWrap(this.ProblemControllerInstance.pagination.bind(this.ProblemControllerInstance))
        );
        this.router.post(
            `/`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PROBLEM, permission: PermissionList.CREATE }),
            asyncWrap(this.ProblemControllerInstance.createProblem.bind(this.ProblemControllerInstance))
        );

        this.router.get(
            `/:problem_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PROBLEM, permission: PermissionList.READ }),
            asyncWrap(this.ProblemControllerInstance.problemById.bind(this.ProblemControllerInstance))
        );
        this.router.put(
            `/:problem_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PROBLEM, permission: PermissionList.UPDATE }),
            asyncWrap(this.ProblemControllerInstance.updateProblem.bind(this.ProblemControllerInstance))
        );
        this.router.delete(
            `/:problem_id`,
            this.MobileAuthMiddlewareInstance.handle.bind(this.MobileAuthMiddlewareInstance),
            this.VerifyAccessMiddlewareInstance.haveAccess({ access: AccessList.PROBLEM, permission: PermissionList.DELETE }),
            asyncWrap(this.ProblemControllerInstance.destroyProblem.bind(this.ProblemControllerInstance))
        );
    }
}
