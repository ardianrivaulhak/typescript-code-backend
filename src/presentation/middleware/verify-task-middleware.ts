import { Auth } from "@/domain/models/auth";
import { TYPES } from "@/types";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { AuthHmiRequest, AuthRequest } from "../utils/types/jwt-request";
import { WebadminAuthService } from "@/services/web-admin/auth-service";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { TaskRepository } from "@/domain/service/task-repository";
import { hmiAuthService } from "@/services/andon/auth-hmi-service";

@injectable()
export class VerifyTaskMiddleware {
    constructor(@inject(TYPES.TaskRepository) private _taskRepository: TaskRepository,
    @inject(TYPES.hmiAuthService) private _hmiAuthService: hmiAuthService
    ) {}
    haveTask() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const token =  <string>req.get("Authorization")?.split(" ")?.[1] || "";
                const shiftId = (await this._hmiAuthService.me(token)).shift.id;
                const task = await this._taskRepository.findRunning(shiftId || "");
                if (!task) {
                    throw new AppError({
                        statusCode: HttpCode.FORBIDDEN,
                        description: "There's no task running!",
                    });
                }
                const newRes: Response = <Response>res;
                newRes.locals.task = task;
                next();
            } catch (error) {
                next(error);
            }
        };
    }
}
