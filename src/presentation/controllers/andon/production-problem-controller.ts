import { AuthHmiRequest } from "@/presentation/utils/types/jwt-request";
import { ProductionProblemService } from "@/services/andon/production-problem-service";
import { TYPES } from "@/types";
import { Response } from "express";
import { injectable, inject } from "inversify";

@injectable()
export default class ProductionProblemController {
    constructor(@inject(TYPES.ProductionProblemService) private _prodProblemService: ProductionProblemService) {}

    public async getByPOId(req: AuthHmiRequest, res: Response): Promise<Response> {
        const data = await this._prodProblemService.findAllByPOId(res.locals.po.id);
        return res.json({
            message: "success",
            data,
        });
    }

    public async add(req: AuthHmiRequest, res: Response): Promise<Response> {
        const data = await this._prodProblemService.store({ ...req.body, productionOrderId: res.locals.po.id });
        return res.json({
            message: "success",
            data,
        });
    }
}
