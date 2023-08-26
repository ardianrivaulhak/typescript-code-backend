import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { PositionService } from "@/services/web-admin/position-service";
import { TYPES } from "@/types";
import { getDataTableScheme } from "@/presentation/validation/data-table-validation";
import { PositionScheme } from "@/presentation/validation/position-validation";

@injectable()
export default class PositionController {
    constructor(@inject(TYPES.PositionService) private _positionService: PositionService) {}

    public async findAll(req: Request, res: Response): Promise<void> {
        const excelBuffer = await this._positionService.findAll();
        const filename = "part.xlsx";
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);
    }
    public async getById(req: Request, res: Response): Promise<Response> {
        const position = await this._positionService.findById(req.params.position_id);
        return res.json({
            message: "success",
            data: position,
        });
    }

    public async store(req: Request, res: Response): Promise<Response> {
        const validatedReq = PositionScheme.safeParse({
            ...req.body,
        });

        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const created = await this._positionService.store(validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { position_id } = req.params;
        const validatedReq = PositionScheme.safeParse({
            ...req.body,
        });

        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        await this._positionService.update(validatedReq.data, position_id);
        return res.json({
            message: "success",
        });
    }

    public async destroy(req: Request, res: Response): Promise<Response> {
        const { position_id } = req.params;

        await this._positionService.destroy(position_id);
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
        const problems = await this._positionService.getDataTable(validatedReq.data);

        return res.json({
            message: "success",
            data: problems,
        });
    }

    public async listPositionForParam (req: Request, res: Response): Promise<Response> {
        const listPositions = await this._positionService.getAll();

        return res.json({
            message: "success",
            data: listPositions,
        });
    }
}
