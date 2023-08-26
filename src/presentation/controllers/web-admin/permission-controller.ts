import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { PermissionService } from "@/services/web-admin/permission-service";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { permissionCreateScheme, permissionDataTableScheme, permissionUpdateScheme } from "../../validation/web-admin/permission-validation";
import { AuthRequest } from "../../utils/types/jwt-request";

@injectable()
export default class PermissionController {
  constructor(@inject(TYPES.PermissionService) private _permissionService: PermissionService) {}

  public async listPermissions(req: Request, res: Response): Promise<Response> {
    const permissions = await this._permissionService.findAll();
    return res.status(200).send({ message: "success", data: permissions.map((val) => val) });
  }

  public async findPermissionById(req: Request, res: Response): Promise<Response> {
    const permission = await this._permissionService.findById(req.params.id);
    return res.json({
      message: "success",
      data: permission,
    });
  }

  public async createPermission(req: Request, res: Response): Promise<Response> {
    const validatedReq = permissionCreateScheme.safeParse({
      ...req.body,
    });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const created = await this._permissionService.store(validatedReq.data);
    return res.json({
      message: "success",
      data: created,
    });
  }

  public async updatePermission(req: Request, res: Response): Promise<Response> {
    const validatedReq = permissionUpdateScheme.safeParse({
      ...req.body,
    });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const created = await this._permissionService.update(req.params.id, validatedReq.data);
    return res.json({
      message: "success",
      data: created,
    });
  }

  public async deletePermission(req: Request, res: Response): Promise<Response> {
    await this._permissionService.destroy(req.params.id);
    return res.json({
      message: "Permission has been deleted",
    });
  }

  public async getDataTable(req: AuthRequest, res: Response): Promise<Response> {
    const validatedReq = permissionDataTableScheme.safeParse(req.query);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const permissions = await this._permissionService.getDataTable(validatedReq.data);
    return res.json({
      message: "success",
      data: permissions,
    });
  }
}
