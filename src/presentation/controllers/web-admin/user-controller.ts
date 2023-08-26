import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { UserService } from "@/services/web-admin/user-service";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { userCreateScheme, userDataTableScheme, userUpdateScheme } from "../../validation/user-validation";
import { AuthRequest } from "../../utils/types/jwt-request";

@injectable()
export default class UserController {
    constructor(@inject(TYPES.UserService) private _userService: UserService) {}

    public async listUsers(req: Request, res: Response): Promise<Response> {
        const users = await this._userService.findAll();
        return res.status(200).send({ message: "success", data: users.map((val) => val) });
    }

    public async findUserById(req: Request, res: Response): Promise<Response> {
        const user = await this._userService.findById(req.params.id);
        return res.json({
            message: "success",
            data: user,
        });
    }

    public async createUser(req: Request, res: Response): Promise<Response> {
        const validatedReq = userCreateScheme.safeParse({
            ...req.body,
            photoUrl: req.file,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const created = await this._userService.store(validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async updateUser(req: Request, res: Response): Promise<Response> {
        const validatedReq = userUpdateScheme.safeParse({
            ...req.body,
            photoUrl: req.file,
        });
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Request validation error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const created = await this._userService.update(req.params.id, validatedReq.data);
        return res.json({
            message: "success",
            data: created,
        });
    }

    public async deleteUser(req: Request, res: Response): Promise<Response> {
        await this._userService.destroy(req.params.id);
        return res.json({
            message: "User has been deleted",
        });
    }

    public async getDataTable(req: AuthRequest, res: Response): Promise<Response> {
        const validatedReq = userDataTableScheme.safeParse(req.query);
        if (!validatedReq.success) {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Validation Error",
                data: validatedReq.error.flatten().fieldErrors,
            });
        }
        const users = await this._userService.getDataTable(validatedReq.data);
        return res.json({
            message: "success",
            data: users,
        });
    }

    public async changePassword(req: Request, res: Response): Promise<Response> {
        const user = await this._userService.changePassword(req.params.id, req.body.password);        
        return res.json({
            message: "success",
            data: user,
        });
    }
}
