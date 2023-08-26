import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { LineService } from "@/services/web-admin/line-service";
import { TYPES } from "@/types";
import { Line } from "@/infrastructure/database/models";
import { lineCreateScheme, lineUpdateScheme } from "@/presentation/validation/line-validation";
import { getDataTableScheme } from "@/presentation/validation/data-table-validation";
import { paginationScheme } from "@/presentation/validation/pagination-validation";

@injectable()
export default class LineController {
    constructor(@inject(TYPES.LineService) private _lineService: LineService) {}

    public async listLines(req: Request, res: Response): Promise<void> {
        const excelBuffer = await this._lineService.findAll();
        const filename = "line.xlsx";
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);
    }
    public async lineById(req: Request, res: Response): Promise<Response> {
        console.log(31321321);
        
        const line = await this._lineService.findById(req.params.line_id);
        return res.json({
            message: "success",
            data: line,
        });
    }

    public async createline(req: Request, res: Response): Promise<Response> {
        const created = await this._lineService.store(req.body);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async createLayoutLine(req: Request, res: Response): Promise<Response> {
        const validatedReq = lineCreateScheme.safeParse({
            ...req.body,
            layout_url: req.file,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const created = await this._lineService.layoutStore(validatedReq.data, req.params.line_id);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async updateline(req: Request, res: Response): Promise<Response> {
        const { line_id } = req.params;
        const validatedReq = lineUpdateScheme.safeParse({
            ...req.body,
            layout_url: req.file,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        await this._lineService.update(validatedReq.data, line_id);
        return res.json({
            message: "success",
        });
    }

    public async destroyline(req: Request, res: Response): Promise<Response> {
        const { line_id } = req.params;

        await this._lineService.destroy(line_id);
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
        const depects = await this._lineService.getDataTable(validatedReq.data);

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

            await this._lineService.importExcel(file);
            res.json({ message: "Excel file imported successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to import Excel file" });
        }
    }

    public async listLineForParam(req: Request, res: Response): Promise<Response> {
        const listLines = await this._lineService.getAll();
        return res.json({
            message: "success",
            data: listLines,
        });
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
        const parts = await this._lineService.pagination({
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
