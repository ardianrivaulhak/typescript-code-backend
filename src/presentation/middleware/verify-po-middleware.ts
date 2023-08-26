import { TYPES } from "@/types";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { ProductionOrderRepository } from "@/domain/service/production-order-repository";

@injectable()
export class VerifyPOMiddleware {
    constructor(
        @inject(TYPES.ProductionOrderRepository) private _poRepository: ProductionOrderRepository
    ) {}
    haveRunning() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const productionOrder = this._poRepository.findRunning(res.locals.task.id);
                if (!productionOrder) {
                    throw new AppError({
                        statusCode: HttpCode.FORBIDDEN,
                        description: "There's no production order running!",
                    });
                }
                res.locals.productionOrder = productionOrder;
                next();
            } catch (error) {
                next(error);
            }
        };
    }
}
