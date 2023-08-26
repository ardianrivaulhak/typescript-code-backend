import { AuthRequest } from "@/presentation/utils/types/jwt-request";
import { validate } from "@/presentation/validation/validate";
import { webadminLoginScheme } from "@/presentation/validation/web-admin/user-validation";
import { WebadminAuthService } from "@/services/web-admin/auth-service";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class WebadminAuthController {
    constructor(@inject(TYPES.WebadminAuthService) private _authService: WebadminAuthService) {}
    public async login(req: Request, res: Response): Promise<Response> {
        const validatedReq = <typeof webadminLoginScheme._output>validate(webadminLoginScheme, req.body);
        const auth = await this._authService.login(validatedReq);
        return res.json({
            message: "success",
            data: auth,
        });
    }
    public async me(req: AuthRequest, res: Response): Promise<Response> {
        const auth = await this._authService.me(<string>req.get("Authorization")?.split(" ")[1]);
        return res.json({
            message: "success",
            data: auth,
        });
    }
}
