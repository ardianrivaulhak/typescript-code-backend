import { AuthHmiRequest } from "@/presentation/utils/types/jwt-request";
import { ProductionSupportService } from "@/services/andon/production-support-service";
import { TYPES } from "@/types";
import { Response } from "express";
import { injectable, inject } from "inversify";

@injectable()
export default class ProductionSupportController {
    constructor(@inject(TYPES.ProductionSupportService) private _prodSupportService: ProductionSupportService) {}

    public async getMaterials(req: AuthHmiRequest, res: Response): Promise<Response> {
        const data = await this._prodSupportService.getMaterials(res.locals.task.id);
        return res.json({
            message: "success",
            data,
        });
    }

    public async updateLotRemark(req: AuthHmiRequest, res: Response): Promise<Response> {
        const data = await this._prodSupportService.updateLotRemark(req.authHmi.user.name, req.body);
        return res.json({
            message: "success",
            data,
        });
    }
}
