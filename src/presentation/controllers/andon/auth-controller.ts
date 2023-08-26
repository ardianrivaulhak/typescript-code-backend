import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { AuthRequest, AuthHmiRequest } from "@/presentation/utils/types/jwt-request";
import { validate } from "@/presentation/validation/validate";
import { hmiLoginScheme } from "@/presentation/validation/web-admin/user-validation";
import { hmiAuthService } from "@/services/andon/auth-hmi-service";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class HmiAuthController {
  constructor(@inject(TYPES.hmiAuthService) private _authService: hmiAuthService) {}
  public async loginHmi(req: Request, res: Response): Promise<Response> {
    const validatedReq = <typeof hmiLoginScheme._output>validate(hmiLoginScheme, req.body);

    const auth = await this._authService.login(validatedReq);
    return res.json({
      message: "Successfully login your account",
      data: auth,
    });
  }

  public async meHmi(req: AuthHmiRequest, res: Response): Promise<Response> {
    const auth = await this._authService.me(<string>req.get("Authorization")?.split(" ")[1]);
    return res.json({
      message: "success",
      data: auth,
    });
  }

  public async logoutHmi(req: AuthHmiRequest, res: Response): Promise<Response> {
    const userId = req.authHmi.user.id;
    await this._authService.logout(userId);
    return res.json({
      message: "Successfully logout your account",
    });
  }
}
