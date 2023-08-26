import { TYPES } from "@/types";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { TaskRepository } from "@/domain/service/task-repository";
import { ProductionOrderRepository } from "@/domain/service/production-order-repository";

@injectable()
export class VerifyProductionOrderMiddleware {
    constructor(
        @inject(TYPES.TaskRepository) private _taskRepository: TaskRepository,
        @inject(TYPES.ProductionOrderRepository) private _poRepository: ProductionOrderRepository
    ) {}
    haveProductionOrder() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const po = await this._poRepository.findRunning(res.locals.task.id);
                if (!po) {
                    throw new AppError({
                        statusCode: HttpCode.FORBIDDEN,
                        description: "There's no production order running!",
                    });
                }
                const newRes: Response = <Response>res;
                newRes.locals.po = po.unmarshal();
                next();
            } catch (error) {
                next(error);
            }
        };
    }
}
