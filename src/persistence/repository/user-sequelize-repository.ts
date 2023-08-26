import { UserRepository } from "@/domain/service/user-repository";
import { Access, AccessPermission, Permission, SessionLogin, User } from "@/infrastructure/database/models";
import { User as EntityUser, IUser } from "@/domain/models/user";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParam } from "@/domain/service/types";
import { Op, where } from "sequelize";
import { Role as RoleDb } from "@/infrastructure/database/models";

@injectable()
export class UserSequelizeRepository implements UserRepository {
    async findByEmail(email: string): Promise<EntityUser> {
        const user = await User.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "User with this email not found",
            });
        }
        return EntityUser.create({
            id: user.getDataValue("id"),
            roleId: user.getDataValue("roleId"),
            email: user.getDataValue("email"),
            password: user.getDataValue("password"),
            name: user.getDataValue("name"),
            isActive: user.getDataValue("isActive"),
            photoUrl: user.getDataValue("photoUrl"),
            createdAt: user.getDataValue("createdAt"),
            updatedAt: user.getDataValue("updatedAt"),
            deletedAt: user.getDataValue("deletedAt"),
        });
    }
    async getDataTable(param: TDataTableParam): Promise<TableData<IUser>> {
        const users = await User.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            include: [
                {
                    model: RoleDb,
                },
            ],
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });
        const totalPages = Math.ceil(users.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;
        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: users.rows.map((item) => ({
                id: item.id,
                email: item.email,
                password: item.password,
                name: item.name,
                isActive: item.isActive,
                photoUrl: item.photoUrl,
                roleId: item.roleId,
                role: item.role,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                deletedAt: item.deletedAt,
            })),
            totalRows: users.count,
            totalPages: Math.ceil(users.count / (param.limit || 10)),
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async findAll(): Promise<EntityUser[]> {
        const users = await User.findAll({
            attributes: ["id", "username", "email"],
        });
        return users.map((user) =>
            EntityUser.create({
                id: user.id,
                email: user.email,
                password: user.password,
                name: user.name,
                isActive: user.isActive,
                photoUrl: user.photoUrl,
                roleId: user.roleId,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                deletedAt: user.deletedAt,
            })
        );
    }

    async findById(id: string): Promise<EntityUser> {
        const user = await User.findByPk(id, {
            include: {
                model: RoleDb,
                attributes: ["id", "name"]
            }
        });
        if (!user) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "User was not found",
            });
        }
        return EntityUser.create({
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            isActive: user.isActive,
            photoUrl: user.photoUrl,
            roleId: user.roleId,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        });
    }
    buildNestedStructure = (data: any) => {
        const accessMap = new Map();
        data.accessPermissions.forEach((item: any) => {
            const accessId = item.accessHasAccess.id;
            if (!accessMap.has(accessId)) {
                accessMap.set(accessId, {
                    id: item.accessHasAccess.id,
                    name: item.accessHasAccess.name,
                    parentId: item.accessHasAccess.parentId,
                    permissions: [],
                    children: [],
                });
            }

            const accessItem = accessMap.get(accessId);
            accessItem.permissions.push({
                id: item.permissionHasAccess.id,
                name: item.permissionHasAccess.name,
            });
        });

        const result: any = [];

        accessMap.forEach((item) => {
            if (!item.parentId) {
                result.push(item);
            } else {
                const parentAccess = accessMap.get(item.parentId);
                if (parentAccess) {
                    parentAccess.children.push(item);
                }
            }
        });

        return {
            id: data.id,
            name: data.name,
            accesses: result,
        };
    };
    async findByIdWithRoleAccess(id: string): Promise<EntityUser> {
        const user = await User.findByPk(id, {
            include: {
                model: RoleDb,
                include: [
                    {
                        model: AccessPermission,
                        where: {
                            status: true,
                        },
                        as: "accessPermissions",
                        attributes: ["id", "accessId", "permissionId"],
                        include: [
                            {
                                model: Access,
                                attributes: ["id", "name", "parentId"],
                                as: "accessHasAccess",
                                order: [["createdAt", "ASC"]],
                            },
                            {
                                model: Permission,
                                attributes: ["id", "name"],
                                as: "permissionHasAccess",
                            },
                        ],
                    },
                ],
            },
        });
        if (!user) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "User was not found",
            });
        }
        const data = this.buildNestedStructure(user?.role);
        const _user = EntityUser.create({
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            isActive: user.isActive,
            photoUrl: user.photoUrl,
            roleId: user.roleId,
            role: data,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        });
        return _user;
    }

    async store(userDomain: EntityUser): Promise<EntityUser> {
        const transaction = await sequelize.transaction();
        try {
            const user = await User.create(
                {
                    id: userDomain.id,
                    email: userDomain.email,
                    password: userDomain.password,
                    name: userDomain.name,
                    isActive: userDomain.isActive,
                    photoUrl: typeof userDomain.photoUrl === "string" ? userDomain.photoUrl : "",
                    roleId: userDomain.roleId,
                },
                {
                    transaction,
                }
            );
            await transaction.commit();
            const entity = EntityUser.create({
                id: user.id,
                email: user.email,
                password: user.password,
                name: user.name,
                isActive: user.isActive,
                photoUrl: user.photoUrl,
                roleId: user.roleId,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                deletedAt: user.deletedAt,
            });
            return entity;
        } catch (e) {
            await transaction.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create user",
                error: e,
            });
        }
    }

    async update(id: string, userDomain: EntityUser): Promise<EntityUser> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "User was not found",
            });
        }
        await user.update({
            email: userDomain.email,
            password: userDomain.password ? userDomain.password : user.getDataValue("password"),
            name: userDomain.name,
            isActive: userDomain.isActive,
            roleId: userDomain.roleId,
            photoUrl: userDomain.photoUrl?.toString(),
        });
        await user.reload();
        return EntityUser.create({
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            isActive: user.isActive,
            photoUrl: user.photoUrl,
            roleId: user.roleId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        });
    }

    async destroy(id: string): Promise<boolean> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "User was not found",
            });
        }
        await user.destroy();
        return true;
    }

    async updatePassword(id: string, password: string): Promise<EntityUser> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "User was not found",
            });
        }
        const entity = EntityUser.create({
            id: user.id,
            email: user.email,
            password,
            name: user.name,
            isActive: user.isActive,
            photoUrl: user.photoUrl,
            roleId: user.roleId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        });      
        entity.password = password; 
        await user.update({
            password: entity.password
        });
        await user.reload();
        return entity;
    }
}
