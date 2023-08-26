import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { MaterialService } from "@/services/web-admin/material-service";
import { TYPES } from "@/types";
import { getDataTableScheme } from "@/presentation/validation/data-table-validation";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { MaterialScheme } from "@/presentation/validation/material-validation";
import { paginationScheme } from "@/presentation/validation/pagination-validation";

@injectable()
export default class EquipmentController {
    constructor(@inject(TYPES.MaterialService) private _matService: MaterialService) {}

    public async findAll(req: Request, res: Response): Promise<void> {
        const excelBuffer = await this._matService.findAll();
        const filename = "material.xlsx";
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);
    }
    public async getById(req: Request, res: Response): Promise<Response> {
        const material = await this._matService.findById(req.params.material_id);
        return res.json({
            message: "success",
            data: material,
        });
    }

    public async store(req: Request, res: Response): Promise<Response> {
        const validatedReq = MaterialScheme.safeParse({
            ...req.body,
        });

        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const created = await this._matService.store(validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { material_id } = req.params;
        const validatedReq = MaterialScheme.safeParse({
            ...req.body,
        });

        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        await this._matService.update(validatedReq.data, material_id);
        return res.json({
            message: "success",
        });
    }

    public async destroy(req: Request, res: Response): Promise<Response> {
        const { material_id } = req.params;

        await this._matService.destroy(material_id);
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
        const problems = await this._matService.getDataTable(validatedReq.data);

        return res.json({
            message: "success",
            data: problems,
        });
    }

    public async import(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file;

            if (!file) {
                res.status(400).json({ error: "File not found" });
                return;
            }

            await this._matService.importExcel(file);
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
        const parts = await this._matService.pagination({
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
