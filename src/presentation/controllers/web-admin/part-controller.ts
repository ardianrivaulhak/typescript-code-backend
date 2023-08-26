import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { PartService } from "@/services/web-admin/part-service";
import { TYPES } from "@/types";
import { PartCreateScheme, PartUpdateScheme } from "@/presentation/validation/part-validation";
import { getDataTableScheme } from "@/presentation/validation/data-table-validation";
import { paginationScheme } from "@/presentation/validation/pagination-validation";

@injectable()
export default class PartController {
    constructor(@inject(TYPES.PartService) private _partService: PartService) {}

    public async findAlll(req: Request, res: Response): Promise<void> {
        const excelBuffer = await this._partService.findAll();
        const filename = "part.xlsx";
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const part = await this._partService.findById(req.params.part_id);
        return res.json({
            message: "success",
            data: part,
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
        const depects = await this._partService.getDataTable(validatedReq.data);

        return res.json({
            message: "success",
            data: depects,
        });
    }

    public async store(req: Request, res: Response): Promise<Response> {
        const validatedReq = PartCreateScheme.safeParse({
            ...req.body,
        });

        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }

        const created = await this._partService.store(validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const validatedReq = PartUpdateScheme.safeParse({
            ...req.body,
        });

        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Error validasi",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }

        try {
            await this._partService.update(validatedReq.data, req.params.part_id);
            res.json({
                message: "Success",
            });
        } catch (error) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Data not valid",
            });
        }
    }

    public async destroy(req: Request, res: Response): Promise<Response> {
        const { part_id } = req.params;

        await this._partService.destroy(part_id);
        return res.json({
            message: "success",
        });
    }

    public async import(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file;
            const method_id: string[] = req.body.method_id || []; // Mendapatkan method_id dari body permintaan

            if (!file) {
                res.status(400).json({ error: "File not found" });
                return;
            }

            await this._partService.importExcel(file, method_id);
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
        const parts = await this._partService.pagination({
            filter:{
                orderBy: validatedReq.data.orderBy,
                sortBy: validatedReq.data.sortBy,
            },
            search: validatedReq.data.search,
            page: validatedReq.data.page,
            limit: validatedReq.data.limit,
            line: validatedReq.data.line?? undefined,
            method: validatedReq.data.method?? undefined,
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
