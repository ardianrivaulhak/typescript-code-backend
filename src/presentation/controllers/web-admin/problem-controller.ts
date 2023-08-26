import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { ProblemService } from "@/services/web-admin/problem-service";
import { TYPES } from "@/types";
import { z } from "zod";
import { getDataTableScheme } from "@/presentation/validation/data-table-validation";
import { ProblemCreateScheme, ProblemUpdateScheme, ProblemsArrayCreateScheme } from "@/presentation/validation/problem-validation";
import multer from "multer";
import { paginationScheme } from "@/presentation/validation/pagination-validation";
@injectable()
export default class ProblemController {
    constructor(@inject(TYPES.ProblemServince) private _probService: ProblemService) {}

    public async listProblems(req: Request, res: Response): Promise<void> {
        const excelBuffer = await this._probService.findAll();
        const filename = "problems.xlsx";
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);
    }
    public async problemById(req: Request, res: Response): Promise<Response> {
        const problems = await this._probService.findById(req.params.problem_id);
        return res.json({
            message: "success",
            data: problems,
        });
    }

    public async createProblem(req: Request, res: Response): Promise<Response> {
        const validatedReq = ProblemCreateScheme.safeParse({
            ...req.body,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const created = await this._probService.store(validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async updateProblem(req: Request, res: Response): Promise<Response> {
        const { problem_id } = req.params;

        const validatedReq = ProblemUpdateScheme.safeParse({
            ...req.body,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }

        await this._probService.update(validatedReq.data, problem_id);
        return res.json({
            message: "success",
        });
    }

    public async destroyProblem(req: Request, res: Response): Promise<Response> {
        const { problem_id } = req.params;

        await this._probService.destroy(problem_id);
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
        const problems = await this._probService.getDataTable(validatedReq.data);

        return res.json({
            message: "success",
            data: problems,
        });
    }

    public async importProblems(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file;

            if (!file) {
                res.status(400).json({ error: "File not found" });
                return;
            }

            await this._probService.importExcel(file);
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
        const parts = await this._probService.pagination({
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
