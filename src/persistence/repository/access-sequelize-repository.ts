import { AccessRepository } from "@/domain/service/access-repository";
import { Access } from "@/infrastructure/database/models";
import { Access as EntityAccess, IAccess } from "@/domain/models/access";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParam } from "@/domain/service/types";
import { Op } from "sequelize";

@injectable()
export class AccessSequelizeReporsitory implements AccessRepository {
  async getDataTable(param: TDataTableParam): Promise<TableData<IAccess>> {
    const accesses = await Access.findAndCountAll({
      where: {
        name: {
          [Op.iLike]: `%${param.search || ""}%`,
        },
        parentId: {
          [Op.is]: null,
        },
      },
      include: {
        model: Access,
        as: "children",
      },
      limit: param.limit ? param.limit : undefined,
      offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
    });
    const totalPages = Math.ceil(accesses.count / (param.limit || 10));
    const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
    const prevPage = param.page === 1 ? null : <number>param.page - 1;

    return TableData.create({
      page: param.page || 1,
      limit: param.limit || 10,
      search: param.search || "",
      data: accesses.rows.map((access) => ({
        id: access.id,
        parentId: access.parentId || null,
        name: access.name,
        children: access.children || [],
        createdAt: access.createdAt,
        updatedAt: access.updatedAt,
        deletedAt: access.deletedAt,
      })),
      totalRows: accesses.count,
      totalPages: Math.ceil(accesses.count / (param.limit || 10)),
      nextPages: <number>nextPage,
      prevPages: <number>prevPage,
    });
  }

  async findAll(): Promise<EntityAccess[]> {
    const accesses = await Access.findAll({
      attributes: ["id", "name"],
    });
    return accesses.map((access) =>
      EntityAccess.create({
        id: access.id,
        name: access.name,
        createdAt: access.createdAt,
        updatedAt: access.updatedAt,
        deletedAt: access.deletedAt,
      })
    );
  }

  async findAllParentAccess(): Promise<EntityAccess[]> {
    const accesses = await Access.findAll({
      attributes: ["id", "name"],
      where: {
        parentId: {
          [Op.is]: null,
        },
      },
      include: {
        model: Access,
        as: "children",
      },
    });
    return accesses.map((access) =>
      EntityAccess.create({
        id: access.id,
        name: access.name,
        children: access.children,
        createdAt: access.createdAt,
        updatedAt: access.updatedAt,
        deletedAt: access.deletedAt,
      })
    );
  }

  async findById(id: string): Promise<EntityAccess> {
    const access = await Access.findByPk(id);
    if (!access) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Access was not found",
      });
    }
    return EntityAccess.create({
      id: access.id,
      name: access.name,
      createdAt: access.createdAt,
      updatedAt: access.updatedAt,
      deletedAt: access.deletedAt,
    });
  }

  async store(userDomain: EntityAccess): Promise<EntityAccess> {
    const transaction = await sequelize.transaction();
    try {
      const access = await Access.create(
        {
          id: userDomain.id,
          name: userDomain.name,
        },
        {
          transaction,
        }
      );
      await transaction.commit();
      const entity = EntityAccess.create({
        id: access.id,
        name: access.name,
        createdAt: access.createdAt,
        updatedAt: access.updatedAt,
        deletedAt: access.deletedAt,
      });
      return entity;
    } catch (e) {
      await transaction.rollback();
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Failed to create access",
        error: e,
      });
    }
  }

  async update(id: string, userDomain: EntityAccess): Promise<EntityAccess> {
    const access = await Access.findByPk(id);
    if (!access) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Access was not found",
      });
    }
    await access.update({
      name: userDomain.name,
    });
    await access.reload();
    return EntityAccess.create({
      id: access.id,
      name: access.name,
      createdAt: access.createdAt,
      updatedAt: access.updatedAt,
      deletedAt: access.deletedAt,
    });
  }

  async destroy(id: string): Promise<boolean> {
    const access = await Access.findByPk(id);
    if (!access) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Access was not found",
      });
    }
    await access.destroy();
    return true;
  }
}
