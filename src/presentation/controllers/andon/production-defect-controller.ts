import { AuthHmiRequest } from "@/presentation/utils/types/jwt-request";
import { ProductionDefectService } from "@/services/andon/production-defect-service";
import { TYPES } from "@/types";
import { Response } from "express";
import { injectable, inject } from "inversify";

@injectable()
export default class ProductionProblemController {
    constructor(@inject(TYPES.ProductionDefectService) private _prodDefectService: ProductionDefectService) {}

    public async getByPOId(req: AuthHmiRequest, res: Response): Promise<Response> {
        const data = await this._prodDefectService.findAllByPOId(res.locals.po.id);
        return res.json({
            message: "success",
            data,
        });
    }

    public async add(req: AuthHmiRequest, res: Response): Promise<Response> {
        const data = await this._prodDefectService.store({ ...req.body, productionOrderId: res.locals.po.id });
        return res.json({
            message: "success",
            data,
        });
    }

    public async destroy(req: AuthHmiRequest, res: Response): Promise<Response> {
        await this._prodDefectService.destroy(req.params.productionDefectId);
        return res.json({
            message: "Production Defect successfully deleted",
        });
    }
}
