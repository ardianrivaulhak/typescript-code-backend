import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { payloadPOCreateScheme, payloadSetEquipmentScheme, payloadSetManpowersScheme } from "../../validation/andon/production-validation";
import { AuthHmiRequest } from "../../utils/types/jwt-request";
import { ProductionPlanService } from "@/services/andon/production-plan-service";
import { manualPOCreateScheme } from "@/presentation/validation/andon/production-validation";

@injectable()
export default class ProductionPlanController {
    constructor(@inject(TYPES.ProductionPlanService) private _ProductionPlanService: ProductionPlanService) {}

    public async findAll(req: Request, res: Response): Promise<Response> {
        const data = await this._ProductionPlanService.findAll();
        return res.json({
            message: "success",
            data,
        });
    }

    public async start(req: AuthHmiRequest, res: Response): Promise<Response> {
        const machineId = req.authHmi.machine.id || "";
        const shiftId = req.authHmi.shift.id || "";
        const data = await this._ProductionPlanService.start(machineId, shiftId);
        
        return res.json({
            message: "success",
            data,
        });
    }

    public async finish(req: AuthHmiRequest, res: Response): Promise<Response> {
        const data = await this._ProductionPlanService.finish(res.locals.task.id);
        return res.json({
            message: "success",
            data,
        });
    }

    public async getTodaySchedule(req: AuthHmiRequest, res: Response): Promise<Response> {
        const data = await this._ProductionPlanService.getTodaySchedule(res.locals.task.id);
        return res.json({
            message: "success",
            data,
        });
    }

    public async createManualPO(req: AuthHmiRequest, res: Response): Promise<Response> {
        const validatedReq = await manualPOCreateScheme.safeParseAsync({
            ...req.body,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const data = await this._ProductionPlanService.createManualPO({
            ...validatedReq.data,
            taskId: res.locals.task.id,
            actualLineId: req.authHmi.machine.line_id,
        });
        return res.json({
            message: "success",
            data,
        });
    }

    public async createPO(req: AuthHmiRequest, res: Response): Promise<Response> {
        const validatedReq = payloadPOCreateScheme.safeParse(req.body);
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const data = await this._ProductionPlanService.createPO(validatedReq.data, res.locals.task.id, req.authHmi.machine.line_id);
        return res.json({
            message: "success",
            data,
        });
    }

    public async getListedEquipment(req: AuthHmiRequest, res: Response): Promise<Response> {
        const data = await this._ProductionPlanService.getListedEquipment(res.locals.task.id);
        return res.json({
            message: "success",
            data,
        });
    }

    public async getUnListedEquipment(req: AuthHmiRequest, res: Response): Promise<Response> {
        const q: string = req.query.q as string;
        const data = await this._ProductionPlanService.getUnlistredEquipment(res.locals.task.id, q ?? "");
        return res.json({
            message: "success",
            data,
        });
    }

    public async setEquipment(req: AuthHmiRequest, res: Response): Promise<Response> {
        const validatedReq = payloadSetEquipmentScheme.safeParse(req.body);
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const data = await this._ProductionPlanService.setEquipment(validatedReq.data, res.locals.task.id);
        return res.json({
            message: "success",
            data,
        });
    }

    public async getListedManpower(req: AuthHmiRequest, res: Response): Promise<Response> {
        const data = await this._ProductionPlanService.getManpowers(req.authHmi.machine.id || "");
        return res.json({
            message: "success",
            data,
        });
    }

    public async setManpowers(req: AuthHmiRequest, res: Response): Promise<Response> {
        const validatedReq = payloadSetManpowersScheme.safeParse(req.body);
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const data = await this._ProductionPlanService.setManpower(validatedReq.data, res.locals.task.id);
        return res.json({
            message: "success",
            data,
        });
    }
}
