import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { ShiftsService } from "@/services/web-admin/shifts-service";
import { TYPES } from "@/types";
import { getDataTableScheme } from "@/presentation/validation/data-table-validation";
import { ShiftsUpdateScheme, ShiftsCreateScheme } from "@/presentation/validation/shifts-validation";
import { paginationScheme } from "@/presentation/validation/pagination-validation";

@injectable()
export default class ShiftsController {
    constructor(@inject(TYPES.ShiftsService) private _shifService: ShiftsService) {}

    public async listShifts(req: Request, res: Response): Promise<void> {
        const excelBuffer = await this._shifService.findAll();
        const filename = "shifts.xlsx";
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);
    }
    public async ShiftsById(req: Request, res: Response): Promise<Response> {
        const shifts = await this._shifService.findById(req.params.shifts_id);
        return res.json({
            message: "success",
            data: shifts,
        });
    }

    public async createShifts(req: Request, res: Response): Promise<Response> {
        const validatedReq = ShiftsCreateScheme.safeParse({
            ...req.body,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const created = await this._shifService.store(validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async updateShifts(req: Request, res: Response): Promise<Response> {
        const { shifts_id } = req.params;

        const validatedReq = ShiftsUpdateScheme.safeParse({
            ...req.body,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        await this._shifService.update(validatedReq.data, shifts_id);
        return res.json({
            message: "success",
        });
    }

    public async destroyShifts(req: Request, res: Response): Promise<Response> {
        const { shifts_id } = req.params;

        await this._shifService.destroy(shifts_id);
        return res.json({
            message: "success",
        });
    }

    public async getDataTable(req: Request, res: Response): Promise<Response> {
        const validatedReq = getDataTableScheme.safeParse(req.query);
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const depects = await this._shifService.getDataTable(validatedReq.data);

        return res.json({
            message: "success",
            data: depects,
        });
    }
    public async import(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file;

            if (!file) {
                res.status(400).json({ error: "File not found" });
                return;
            }

            await this._shifService.importExcel(file);
            res.json({ message: "Excel file imported successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to import Excel file" });
        }
    }

    public async pagination (req: Request, res: Response): Promise<Response> {
        const validatedReq = paginationScheme.safeParse(req.query);
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }        
        const parts = await this._shifService.pagination({
            filter:{
                orderBy: validatedReq.data.orderBy,
                sortBy: validatedReq.data.sortBy,
            },
            search: validatedReq.data.search,
            page: validatedReq.data.page,
            limit: validatedReq.data.limit,
        });
        const {page,limit,search,totalPages,totalRows,nextPages,prevPages, ...data} = parts;
        const pagination = {
            page,
            limit,
            search,
            totalPages,
            totalRows,
            nextPages,
            prevPages
        };
        return res.json({
            message: "success",
            pagination: pagination,
            data: data.data,
        });
    }
}
