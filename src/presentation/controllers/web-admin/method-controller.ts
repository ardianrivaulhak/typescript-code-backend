import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { TYPES } from "@/types";
import { MethodService } from "@/services/web-admin/method-service";
import { methodCreateScheme, methodUpdateScheme } from "@/presentation/validation/method-validation";
import { getDataTableScheme } from "@/presentation/validation/data-table-validation";
import { paginationScheme } from "@/presentation/validation/pagination-validation";

@injectable()
export default class MethodController {
    constructor(@inject(TYPES.MethodService) private _metService: MethodService) {}
    public async listMethods(req: Request, res: Response): Promise<void> {
        const excelBuffer = await this._metService.findAll();
        const filename = "method.xlsx";
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);
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
        const problems = await this._metService.getDataTable(validatedReq.data);

        return res.json({
            message: "success",
            data: problems,
        });
    }
    public async methodById(req: Request, res: Response): Promise<Response> {
        const method = await this._metService.findById(req.params.method_id);
        return res.json({
            message: "success",
            data: method,
        });
    }

    public async createMethod(req: Request, res: Response): Promise<Response> {
        const validatedReq = methodCreateScheme.safeParse({
            ...req.body,
            file_url: req.file,
        });

        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }

        const created = await this._metService.store(validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async updateMethod(req: Request, res: Response): Promise<Response> {
        const validatedReq = methodUpdateScheme.safeParse({
            ...req.body,
            file_url: req.file,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }

        const created = await this._metService.update(req.params.method_id, validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async destroyMethod(req: Request, res: Response): Promise<Response> {
        const { method_id } = req.params;

        await this._metService.destroy(method_id);
        return res.json({
            message: "success",
        });
    }

    public async import(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file;

            if (!file) {
                res.status(400).json({ error: "File not found" });
                return;
            }

            await this._metService.importExcel(file);
            res.json({ message: "Excel file imported successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to import Excel file" });
        }
    }

    public async listMethodForParam(req: Request, res: Response): Promise<Response> {
        const listMethods = await this._metService.getAll();
        return res.json({
            message: "success",
            data: listMethods,
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
        const parts = await this._metService.pagination({
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
