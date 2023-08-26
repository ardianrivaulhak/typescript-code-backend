import { PermissionRepository } from "@/domain/service/permission-repository";
import { Permission } from "@/infrastructure/database/models";
import { Permission as EntityPermission, IPermission } from "@/domain/models/permission";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParam } from "@/domain/service/types";
import { Op } from "sequelize";

@injectable()
export class PermissionSequelizeReporsitory implements PermissionRepository {
  async getDataTable(param: TDataTableParam): Promise<TableData<IPermission>> {
    const permissions = await Permission.findAndCountAll({
      where: {
        name: {
          [Op.iLike]: `%${param.search || ""}%`,
        },
      },
      limit: param.limit ? param.limit : undefined,
      offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
    });

    const totalPages = Math.ceil(permissions.count / (param.limit || 10));
    const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
    const prevPage = param.page === 1 ? null : <number>param.page - 1;

    return TableData.create({
      page: param.page || 1,
      limit: param.limit || 10,
      search: param.search || "",
      data: permissions.rows.map((permission) => ({
        id: permission.id,
        name: permission.name,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
        deletedAt: permission.deletedAt,
      })),
      totalRows: permissions.count,
      totalPages: Math.ceil(permissions.count / (param.limit || 10)),
      nextPages: <number>nextPage,
      prevPages: <number>prevPage,
    });
  }

  async findAll(): Promise<EntityPermission[]> {
    const permissions = await Permission.findAll({
      attributes: ["id", "name"],
    });
    return permissions.map((permission) =>
      EntityPermission.create({
        id: permission.id,
        name: permission.name,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
        deletedAt: permission.deletedAt,
      })
    );
  }

  async findById(id: string): Promise<EntityPermission> {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Permission was not found",
      });
    }
    return EntityPermission.create({
      id: permission.id,
      name: permission.name,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
      deletedAt: permission.deletedAt,
    });
  }

  async store(permissionDomain: EntityPermission): Promise<EntityPermission> {
    const transaction = await sequelize.transaction();
    try {
      const permission = await Permission.create(
        {
          id: permissionDomain.id,
          name: permissionDomain.name,
        },
        {
          transaction,
        }
      );
      await transaction.commit();
      const entity = EntityPermission.create({
        id: permission.id,
        name: permission.name,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
        deletedAt: permission.deletedAt,
      });
      return entity;
    } catch (e) {
      await transaction.rollback();
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Failed to create permission",
        error: e,
      });
    }
  }

  async update(id: string, permissionDomain: EntityPermission): Promise<EntityPermission> {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Permission was not found",
      });
    }
    await permission.update({
      name: permissionDomain.name,
    });
    await permission.reload();
    return EntityPermission.create({
      id: permission.id,
      name: permission.name,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
      deletedAt: permission.deletedAt,
    });
  }

  async destroy(id: string): Promise<boolean> {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Permission was not found",
      });
    }
    await permission.destroy();
    return true;
  }
}
