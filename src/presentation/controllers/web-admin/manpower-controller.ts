import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { ManpowerService } from "@/services/web-admin/manpower-service";
import { TYPES } from "@/types";
import { ManpowerScheme } from "@/presentation/validation/manpower-validation";
import { getDataTableScheme } from "@/presentation/validation/data-table-validation";
import { paginationScheme } from "@/presentation/validation/pagination-validation";
@injectable()
export default class ManpowerController {
    constructor(@inject(TYPES.ManpowerService) private _manService: ManpowerService) {}

    public async store(req: Request, res: Response): Promise<Response> {
        const validatedReq = ManpowerScheme.safeParse({
            ...req.body,
        });

        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }

        const created = await this._manService.store(validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { manpower_id } = req.params;
        const validatedReq = ManpowerScheme.safeParse({
            ...req.body,
        });

        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        await this._manService.update(validatedReq.data, manpower_id);
        return res.json({
            message: "success",
        });
    }

    public async destroy(req: Request, res: Response): Promise<Response> {
        const { manpower_id } = req.params;

        await this._manService.destroy(manpower_id);
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
        const manpower = await this._manService.getDataTable(validatedReq.data);

        return res.json({
            message: "success",
            data: manpower,
        });
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const manpower = await this._manService.findById(req.params.manpower_id);
        return res.json({
            message: "success",
            data: manpower,
        });
    }

    public async findAll(req: Request, res: Response): Promise<void> {
        const excelBuffer = await this._manService.findAll();
        const filename = "manpower.xlsx";
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);
    }

    public async import(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file;

            if (!file) {
                res.status(400).json({ error: "File not found" });
                return;
            }

            await this._manService.importExcel(file);
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
        const parts = await this._manService.pagination({
            filter:{
                orderBy: validatedReq.data.orderBy,
                sortBy: validatedReq.data.sortBy,
            },
            search: validatedReq.data.search,
            page: validatedReq.data.page,
            limit: validatedReq.data.limit,
            line: validatedReq.data.line?? undefined,
            position: validatedReq.data.position?? undefined,
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
