import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { EquipmentService } from "@/services/web-admin/equipment-service";
import { TYPES } from "@/types";
import { z } from "zod";
import { getDataTableScheme } from "@/presentation/validation/data-table-validation";
import { EquipmentScheme } from "@/presentation/validation/equipment-validation";
import { paginationScheme } from "@/presentation/validation/pagination-validation";
@injectable()
export default class EquipmentController {
    constructor(@inject(TYPES.EquipmentService) private _equipService: EquipmentService) {}
    public async getById(req: Request, res: Response): Promise<Response> {
        const equipment = await this._equipService.findById(req.params.equipment_id);
        return res.json({
            message: "success",
            data: equipment,
        });
    }

    public async store(req: Request, res: Response): Promise<Response> {
        const validatedReq = EquipmentScheme.safeParse({
            ...req.body,
        });

        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }

        const created = await this._equipService.store(validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { equipment_id } = req.params;
        const validatedReq = EquipmentScheme.safeParse({
            ...req.body,
        });

        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }

        await this._equipService.update(validatedReq.data, equipment_id);
        return res.json({
            message: "success",
        });
    }

    public async destroy(req: Request, res: Response): Promise<Response> {
        const { equipment_id } = req.params;

        await this._equipService.destroy(equipment_id);
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
        const depects = await this._equipService.getDataTable(validatedReq.data);

        return res.json({
            message: "success",
            data: depects,
        });
    }

    public async findAll(req: Request, res: Response): Promise<void> {
        const excelBuffer = await this._equipService.findAll();
        const filename = "equipment.xlsx";
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

            await this._equipService.importExcel(file);
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
        const parts = await this._equipService.pagination({
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
