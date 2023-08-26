import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { AccessService } from "@/services/web-admin/access-service";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { accessCreateScheme, accessDataTableScheme, accessUpdateScheme } from "../../validation/web-admin/access-validation";
import { AuthRequest } from "../../utils/types/jwt-request";

@injectable()
export default class AccessController {
  constructor(@inject(TYPES.AccessService) private _accessService: AccessService) {}

  public async findAccessById(req: Request, res: Response): Promise<Response> {
    const access = await this._accessService.findById(req.params.id);
    return res.json({
      message: "success",
      data: access,
    });
  }

  public async createAccess(req: Request, res: Response): Promise<Response> {
    const validatedReq = accessCreateScheme.safeParse({
      ...req.body,
    });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const created = await this._accessService.store(validatedReq.data);
    return res.json({
      message: "success",
      data: created,
    });
  }

  public async updateAccess(req: Request, res: Response): Promise<Response> {
    const validatedReq = accessUpdateScheme.safeParse({
      ...req.body,
    });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const created = await this._accessService.update(req.params.id, validatedReq.data);
    return res.json({
      message: "success",
      data: created,
    });
  }

  public async deleteAccess(req: Request, res: Response): Promise<Response> {
    await this._accessService.destroy(req.params.id);
    return res.json({
      message: "access has been deleted",
    });
  }

  public async getDataTable(req: AuthRequest, res: Response): Promise<Response> {
    const validatedReq = accessDataTableScheme.safeParse(req.query);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const accesses = await this._accessService.getDataTable(validatedReq.data);
    return res.json({
      message: "success",
      data: accesses,
    });
  }
}
