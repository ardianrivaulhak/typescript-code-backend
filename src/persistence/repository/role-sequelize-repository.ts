import { RoleRepository } from "@/domain/service/role-repository";
import { AccessPermission, Permission, Role } from "@/infrastructure/database/models";
import { Role as EntityRole, IRole } from "@/domain/models/role";
import { AccessPermission as EntityAccessPermission, IAccessPermission } from "@/domain/models/access_permission";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataAssignRoleAccess, TDataTableParam } from "@/domain/service/types";
import { Op } from "sequelize";
import { Access } from "@/infrastructure/database/models/access-sequelize";
import { IRoleAccessData } from "@/dto/role-dto";

@injectable()
export class RoleSequelizeReporsitory implements RoleRepository {
  async getDataTable(param: TDataTableParam): Promise<TableData<IRole>> {
    const roles = await Role.findAndCountAll({
      where: {
        name: {
          [Op.iLike]: `%${param.search || ""}%`,
        },
      },
      limit: param.limit ? param.limit : undefined,
      offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
    });

    const totalPages = Math.ceil(roles.count / (param.limit || 10));
    const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
    const prevPage = param.page === 1 ? null : <number>param.page - 1;

    return TableData.create({
      page: param.page || 1,
      limit: param.limit || 10,
      search: param.search || "",
      data: roles.rows.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
      })),
      totalRows: roles.count,
      totalPages: Math.ceil(roles.count / (param.limit || 10)),
      nextPages: <number>nextPage,
      prevPages: <number>prevPage,
    });
  }

  async findAll(): Promise<EntityRole[]> {
    const roles = await Role.findAll({
      attributes: ["id", "name"],
    });
    return roles.map((role) =>
      EntityRole.create({
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        deletedAt: role.deletedAt,
      })
    );
  }

  async findById(id: string): Promise<EntityRole> {
    const role = await Role.findByPk(id);
    if (!role) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role was not found",
      });
    }
    return EntityRole.create({
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      deletedAt: role.deletedAt,
    });
  }

  // async findByIdWithAccessAndPermission(id: string): Promise<IRoleAccessData> {
  //   const role = await Role.findByPk(id, {
  //     include: {
  //       model: Access,
  //       where: {
  //         parentId: {
  //           [Op.is]: null,
  //         },
  //       },
  //       include: [
  //         {
  //           model: Access,
  //           as: "children",
  //         },
  //       ],
  //       attributes: ["id", "name"],
  //       through: {
  //         attributes: [],
  //       },
  //     },
  //   });
  //   if (!role) {
  //     throw new AppError({
  //       statusCode: HttpCode.NOT_FOUND,
  //       description: "Role was not found",
  //     });
  //   }
  //   return EntityRole.create({
  //     id: role.id,
  //     name: role.name,
  //     accesses: role.accesses,
  //   });
  // }

  // include: {
  //   model: Access,
  //   attributes: ["id", "name", "parentId"],
  //   where: {
  //     parentId: {
  //       [Op.is]: null,
  //     },
  //   },
  //   through: {
  //     attributes: [],
  //   },
  //   include: [
  //     {
  //       model: Access,
  //       as: "children",
  //       attributes: ["id", "name", "parentId"],
  //     },
  //   ],
  // },
  async findByIdWithAccessAndPermission(id: string): Promise<IRole> {
    const role = await Role.findByPk(id, {
      include: [
        {
          model: Access,
          attributes: ["id", "name", "parentId"],
          where: {
            parentId: {
              [Op.is]: null,
            },
          },
          include: [
            {
              model: Permission,
              attributes: ["id", "name"],
              through: {
                as: "permissionHasAccess",
                attributes: ["status", "isDisabled"],
              },
            },
            {
              model: Access,
              attributes: ["id", "name", "parentId"],
              as: "children",
              separate: true,
              include: [
                {
                  model: Permission,
                  attributes: ["id", "name"],
                  through: {
                    as: "permissionHasAccess",
                    attributes: ["status", "isDisabled"],
                  },
                },
              ],
            },
          ],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!role) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role was not found",
      });
    }

    return EntityRole.create({
      id: role.id,
      name: role.name,
      accesses: role.accesses,
    });
  }

  async store(roleDomain: EntityRole): Promise<EntityRole> {
    const transaction = await sequelize.transaction();
    try {
      const role = await Role.create(
        {
          id: roleDomain.id,
          name: roleDomain.name,
        },
        {
          transaction,
        }
      );
      await transaction.commit();
      const entity = EntityRole.create({
        id: role.id,
        name: role.name,
        accesses: undefined,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        deletedAt: role.deletedAt,
      });
      return entity;
    } catch (e) {
      await transaction.rollback();
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Failed to create role",
        error: e,
      });
    }
  }

  async update(id: string, roleDomain: EntityRole): Promise<EntityRole> {
    const role = await Role.findByPk(id);
    if (!role) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role was not found",
      });
    }
    await role.update({
      name: roleDomain.name,
    });
    await role.reload();
    return EntityRole.create({
      id: role.id,
      name: role.name,
      accesses: undefined,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      deletedAt: role.deletedAt,
    });
  }

  async destroy(id: string): Promise<boolean> {
    const role = await Role.findByPk(id);
    if (!role) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role was not found",
      });
    }
    await role.destroy();
    return true;
  }

  async assignAccessAndPermission(id: string, param: TDataAssignRoleAccess): Promise<boolean> {
    const role = await Role.findByPk(id);
    if (!role) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Role was not found",
      });
    }
    const accessPermission = await AccessPermission.findOne({
      where: {
        roleId: role.id,
        accessId: param.accessId,
        permissionId: param.permissionsId,
      },
    });

    if (!accessPermission) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Access Permission was not found",
      });
    }

    await accessPermission.update({
      status: param.status,
    });

    return true;
  }
}
