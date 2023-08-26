import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { RoleService } from "@/services/web-admin/role-service";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { roleCreateScheme, roleDataTableScheme, roleUpdateAccessAndPermissionScheme, roleUpdateScheme } from "../../validation/web-admin/role-validation";
import { AuthRequest } from "../../utils/types/jwt-request";

@injectable()
export default class RoleController {
  constructor(@inject(TYPES.RoleService) private _roleService: RoleService) {}

  public async listRoles(req: Request, res: Response): Promise<Response> {
    const roles = await this._roleService.findAll();
    return res.status(200).send({ message: "success", data: roles.map((val) => val) });
  }

  public async findRoleById(req: Request, res: Response): Promise<Response> {
    const role = await this._roleService.findById(req.params.id);
    return res.json({
      message: "success",
      data: role,
    });
  }

  public async createRole(req: Request, res: Response): Promise<Response> {
    const validatedReq = roleCreateScheme.safeParse({
      ...req.body,
    });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const created = await this._roleService.store({ ...validatedReq.data, accesses: undefined });
    return res.json({
      message: "success",
      data: created,
    });
  }

  public async updateRole(req: Request, res: Response): Promise<Response> {
    const validatedReq = roleUpdateScheme.safeParse({
      ...req.body,
    });
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const created = await this._roleService.update(req.params.id, { ...validatedReq.data });
    return res.json({
      message: "success",
      data: created,
    });
  }

  public async deleteRole(req: Request, res: Response): Promise<Response> {
    await this._roleService.destroy(req.params.id);
    return res.json({
      message: "Role has been deleted",
    });
  }

  public async getDataTable(req: AuthRequest, res: Response): Promise<Response> {
    const validatedReq = roleDataTableScheme.safeParse(req.query);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Validation Error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const roles = await this._roleService.getDataTable(validatedReq.data);
    return res.json({
      message: "success",
      data: roles,
    });
  }

  public async getDetailWithAccessAndPermission(req: Request, res: Response): Promise<Response> {
    const role = await this._roleService.getDetailAccessAndPermission(req.params.id);
    return res.json({
      message: "success",
      data: role,
    });
  }

  public async updateAccessAndPermission(req: Request, res: Response): Promise<Response> {
    const validatedReq = roleUpdateAccessAndPermissionScheme.safeParse(req.body);
    if (!validatedReq.success) {
      throw new AppError({
        statusCode: HttpCode.VALIDATION_ERROR,
        description: "Request validation error",
        data: validatedReq.error.flatten().fieldErrors,
      });
    }
    const role = await this._roleService.assignAccessAndPermission(req.params.id, validatedReq.data);

    return res.json({
      message: "success",
      data: role,
    });
  }
}
