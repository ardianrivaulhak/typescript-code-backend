import { Auth } from "@/domain/models/auth";
import { TYPES } from "@/types";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { AuthRequest } from "../utils/types/jwt-request";
import { WebadminAuthService } from "@/services/web-admin/auth-service";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";

@injectable()
export class VerifyAccessMiddleware {
  constructor(@inject(TYPES.WebadminAuthService) private _authService: WebadminAuthService) {}
  haveAccess(param: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await this._authService.me(<string>req.get("Authorization")?.split(" ")?.[1] || "");
        const access = user.user.role?.accesses?.find((el) => el.name === param.access);
        if (access) {
          if (!access.permissions?.find((el) => el.name === param.permission)) {
            throw new AppError({
              statusCode: HttpCode.FORBIDDEN,
              description: "You dont have access use this transaction",
            });
          }
        } else {
          let access = false;
          let permission = false;
          user.user.role?.accesses?.forEach((el) => {
            const accessChild = el.children?.find((el) => el.name === param.access);
            if (accessChild) {
              access = true;
            }
            if (accessChild?.permissions?.find((permission) => permission.name === param.permission)) {
              permission = true;
            }
          });
          if (!access || !permission) {
            throw new AppError({
              statusCode: HttpCode.FORBIDDEN,
              description: "You dont have access use this transaction",
            });
          }
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
