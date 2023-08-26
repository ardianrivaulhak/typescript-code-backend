import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { ScheduleService } from "@/services/web-admin/schedule-service";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { scheduleCreateScheme, scheduleDataTableScheme, scheduleUpdateScheme } from "../../validation/web-admin/schedule-validation";
import { AuthRequest } from "../../utils/types/jwt-request";

@injectable()
export default class ScheduleController {
    constructor(@inject(TYPES.ScheduleService) private _scheduleService: ScheduleService) {}

    public async findById(req: Request, res: Response): Promise<Response> {
        const schedule = await this._scheduleService.findById(req.params.id);
        return res.json({
            message: "success",
            data: schedule,
        });
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const validatedReq = scheduleCreateScheme.safeParse({
            ...req.body,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const created = await this._scheduleService.store({...validatedReq.data, balance: validatedReq.data.qty, status: "open"});
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const validatedReq = scheduleUpdateScheme.safeParse({
            ...req.body,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const created = await this._scheduleService.update(req.params.id, validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        await this._scheduleService.destroy(req.params.id);
        return res.json({
            message: "schedule has been deleted",
        });
    }

    public async getDataTable(req: AuthRequest, res: Response): Promise<Response> {
        const validatedReq = scheduleDataTableScheme.safeParse(req.query);
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const schedules = await this._scheduleService.getDataTable(validatedReq.data);
        return res.json({
            message: "success",
            data: schedules,
        });
    }
}
