import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { DefectsService } from "@/services/web-admin/depects-service";
import { TYPES } from "@/types";
import { getDataTableScheme } from "@/presentation/validation/data-table-validation";
import { DepectsUpdateScheme, DepectsCreateScheme } from "@/presentation/validation/depects-validation";
import { paginationScheme } from "@/presentation/validation/pagination-validation";
@injectable()
export default class DepectsController {
    constructor(@inject(TYPES.DepectsService) private _devService: DefectsService) {}

    public async listDefects(req: Request, res: Response): Promise<void> {
        const excelBuffer = await this._devService.findAll();
        const filename = "depects.xlsx";
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);
    }
    public async depectsById(req: Request, res: Response): Promise<Response> {
        const depects = await this._devService.findById(req.params.depects_id);
        return res.json({
            message: "success",
            data: depects,
        });
    }

    public async createDepects(req: Request, res: Response): Promise<Response> {
        const validatedReq = DepectsCreateScheme.safeParse({
            ...req.body,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const created = await this._devService.store(validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async updateDepects(req: Request, res: Response): Promise<Response> {
        const validatedReq = DepectsUpdateScheme.safeParse({
            ...req.body,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const { depects_id } = req.params;

        await this._devService.update(validatedReq.data, depects_id);
        return res.json({
            message: "success",
        });
    }

    public async destroyDepects(req: Request, res: Response): Promise<Response> {
        const { depects_id } = req.params;

        await this._devService.destroy(depects_id);
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
        const depects = await this._devService.getDataTable(validatedReq.data);

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

            await this._devService.importExcel(file);
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
        const parts = await this._devService.pagination({
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
