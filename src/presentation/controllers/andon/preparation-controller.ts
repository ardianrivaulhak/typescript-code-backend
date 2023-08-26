import { AuthHmiRequest } from "@/presentation/utils/types/jwt-request";
import { PreparationService } from "@/services/andon/preparation-service";
import { TYPES } from "@/types";
import { Response } from "express";
import { injectable, inject } from "inversify";

@injectable()
export default class PreparationController {
    constructor(@inject(TYPES.PreparationService) private _prepService: PreparationService) {}

    public async getSelectionPO(req: AuthHmiRequest, res: Response): Promise<Response> {
        const data = await this._prepService.getSelectionPO(res.locals.task.id);
        return res.json({
            message: "success",
            data,
        });
    }

    public async startPreparation(req: AuthHmiRequest, res: Response): Promise<Response> {
        const data = await this._prepService.startPO(req.params.productionOrderId);
        return res.json({
            message: "success",
            data,
        });
    }
}
