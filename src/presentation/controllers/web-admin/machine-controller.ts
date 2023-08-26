import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { MachineService } from "@/services/web-admin/machine-service";
import { TYPES } from "@/types";
import { getDataTableScheme } from "@/presentation/validation/data-table-validation";
import { MachineCreateScheme, MachineUpdateScheme } from "@/presentation/validation/machine-validation";
import { paginationScheme } from "@/presentation/validation/pagination-validation";
@injectable()
export default class MachineController {
    constructor(@inject(TYPES.MachineService) private _macService: MachineService) {}

    public async listMachine(req: Request, res: Response): Promise<void> {
        const excelBuffer = await this._macService.findAll();
        const filename = "machine.xlsx";
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);
    }

    public async machineById(req: Request, res: Response): Promise<Response> {
        const machine = await this._macService.findById(req.params.machine_id);
        return res.json({
            message: "success",
            data: machine,
        });
    }
    public async createMachine(req: Request, res: Response): Promise<Response> {
        const validatedReq = MachineCreateScheme.safeParse({
            ...req.body,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const created = await this._macService.store(validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async updateMachine(req: Request, res: Response): Promise<Response> {
        const { machine_id } = req.params;
        const validatedReq = MachineUpdateScheme.safeParse({
            ...req.body,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }

        await this._macService.update(req.body, machine_id);
        return res.json({
            message: "success",
        });
    }

    public async destroyMachine(req: Request, res: Response): Promise<Response> {
        const { machine_id } = req.params;

        await this._macService.destroy(machine_id);
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
        const machine = await this._macService.getDataTable(validatedReq.data);

        return res.json({
            message: "success",
            data: machine,
        });
    }

    public async import(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file;

            if (!file) {
                res.status(400).json({ error: "File not found" });
                return;
            }

            await this._macService.importExcel(file);
            res.json({ message: "Excel file imported successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to import Excel file" });
        }
    }

    public async listMachineForParam(req: Request, res: Response): Promise<Response> {
        const listMachines = await this._macService.getAll();
        return res.json({
            message: "success",
            data: listMachines,
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
        const parts = await this._macService.pagination({
            filter:{
                orderBy: validatedReq.data.orderBy,
                sortBy: validatedReq.data.sortBy,
            },
            search: validatedReq.data.search,
            page: validatedReq.data.page,
            limit: validatedReq.data.limit,
            line: validatedReq.data.line?? undefined,
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
