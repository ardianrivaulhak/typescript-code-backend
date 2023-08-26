import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { AuthHmiRequest } from "@/presentation/utils/types/jwt-request";
import { methodPaginationParamScheme, methodLogCreateScheme } from "@/presentation/validation/andon/method-valitdation";
import { MethodHmiService } from "@/services/andon/method-service";
import { TYPES } from "@/types";
import { Response } from "express";
import { injectable, inject } from "inversify";

@injectable()
export default class PreparationController {
    constructor(@inject(TYPES.MethodHmiService) private _methodService: MethodHmiService) {}

    public async getAll(req: AuthHmiRequest, res: Response): Promise<Response> {
        const validatedReq = methodPaginationParamScheme.safeParse(req.query);
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const { data, pagination } = await this._methodService.getAllMethods(res.locals.po.id, validatedReq.data);
        return res.json({
            message: "success",
            pagination,
            data,
        });
    }

    public async addRemark(req: AuthHmiRequest, res: Response): Promise<Response> {
        const validatedReq = methodLogCreateScheme.safeParse(req.body);
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const remark = await this._methodService.addRemark(res.locals.task.id, { ...validatedReq.data, reportBy: req.authHmi.user.name });
        return res.json({
            message: "success",
            data: remark,
        });
    }

    public async getMethodLog(req: AuthHmiRequest, res: Response): Promise<Response> {
        const logs = await this._methodService.getLog(res.locals.task.id);
        return res.json({
            message: "success",
            data: logs
        });
    }
}
