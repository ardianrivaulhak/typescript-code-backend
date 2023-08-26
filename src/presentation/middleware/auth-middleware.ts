import { Auth } from "@/domain/models/auth";
import { TYPES } from "@/types";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { AuthRequest, AuthHmiRequest } from "../utils/types/jwt-request";
import { WebadminAuthService } from "@/services/web-admin/auth-service";
import { hmiAuthService } from "@/services/andon/auth-hmi-service";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { AuthHmi } from "@/domain/models/auth-hmi";

@injectable()
export class MobileAuthMiddleware {
    constructor(
        @inject(TYPES.WebadminAuthService) private _authService: WebadminAuthService,
        @inject(TYPES.hmiAuthService) private _hmiAuthService: hmiAuthService
    ) {}

    public async handle(req: Request, res: Response, next: NextFunction) {
        const token = <string>req.get("Authorization")?.split(" ")?.[1] || "";
        try {
            const user = await this._authService.me(token);
            const newReq: AuthRequest = <AuthRequest>req;
            newReq.auth = Auth.create(user);
            next();
        } catch (error) {
            next(
                new AppError({
                    statusCode: HttpCode.UNAUTHORIZED,
                    description: "Unauthorized",
                })
            );
        }
    }

    public async handleHmi(req: Request, res: Response, next: NextFunction) {
        const token = <string>req.get("Authorization")?.split(" ")?.[1] || "";
        try {
            const user = await this._hmiAuthService.me(token);
            const newReq: AuthHmiRequest = <AuthHmiRequest>req;
            newReq.authHmi = AuthHmi.create(user);
            next();
        } catch (error) {
            next(
                new AppError({
                    statusCode: HttpCode.UNAUTHORIZED,
                    description: "Unauthorized",
                })
            );
        }
    }
}
