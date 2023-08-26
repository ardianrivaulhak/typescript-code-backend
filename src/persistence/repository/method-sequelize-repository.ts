import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPaginationParam, TPagination } from "@/domain/service/types";
import { Method, Part } from "@/infrastructure/database/models";
import { MethodRepository } from "@/domain/service/method-repository";
import { Method as EntityMethod, IMethod } from "@/domain/models/methods";
import { Op, Order } from "sequelize";
import { IPaginationData, PaginationData } from "@/domain/models/pagination-data";
import { IListMethodHMI } from "@/dto/method-dto";
@injectable()
export class MethodSequelizeRepository implements MethodRepository {
    async import(methods: IMethod[]): Promise<EntityMethod[]> {
        const t = await sequelize.transaction();
        try {
            const createdEntities: EntityMethod[] = [];

            for (const method of methods) {
                const p = await Method.create(
                    {
                        id: method.id,
                        name: method.name,
                        no_method: method.no_method,
                        file_url: typeof method.file_url === "string" ? method.file_url : "",
                    },
                    { transaction: t }
                );

                const entityPart = EntityMethod.create({
                    id: p.id,
                    name: p.name,
                    no_method: p.no_method,
                    file_url: p.file_url,
                });

                createdEntities.push(entityPart);
            }

            await t.commit();
            return createdEntities;
        } catch (error) {
            await t.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create method",
                error: error,
            });
        }
    }
    async findAll(): Promise<EntityMethod[]> {
        const lines = await Method.findAll();
        return lines.map((el) =>
            EntityMethod.create({
                id: el.id,
                name: el.name,
                no_method: el.no_method,
                file_url: el.file_url,
            })
        );
    }
    async findAllByPartId(partId: string, param: TPaginationParam): Promise<PaginationData<IListMethodHMI>> {
        const { rows, count } = await Method.findAndCountAll({
            include: {
                model: Part,
                where: {
                    id: partId
                },
                through: {
                    as: "part_has_method",
                    attributes: [],
                },
            },
            limit: param.limit || 10,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });
        const totalPages = Math.ceil(count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;
        return PaginationData.create({
            pagination: {
                page: param.page || 1,
                limit: param.limit || 10,
                totalPages,
                totalRows: count,
                nextPages: <number>nextPage,
                prevPages: <number>prevPage,
            },
            data: rows.map((el) => ({ id: el.id, name: el.name, fileUrl: <string>el.file_url })),
        });
    }
    async findById(method_id: string): Promise<EntityMethod> {
        try {
            const method = await Method.findByPk(method_id);

            if (!method) {
                throw new AppError({
                    statusCode: HttpCode.NOT_FOUND,
                    description: "Method not found",
                });
            }

            await method.save();

            return EntityMethod.create({
                id: method.id,
                name: method.name,
                no_method: method.no_method,
                file_url: method.file_url,
            });
        } catch (e) {
            console.log(e);
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create method",
                error: e,
            });
        }
    }
    async getDataTable(param: TDataTableParamFilter): Promise<TableData<IMethod>> {
        let order: Order | undefined;

        switch (param.filterDate) {
            case "since-asc":
                order = [["created_at", "ASC"]];
                break;
            case "since-desc":
                order = [["created_at", "DESC"]];
                break;
            default:
                order = [["created_at", "DESC"]];
                break;
        }
        const methods = await Method.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order: order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalPages = Math.ceil(methods.count / (param.limit || 10));

        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: methods.rows.map((item) => ({
                id: item.id,
                name: item.name,
                no_method: item.no_method,
                file_url: item.file_url,
            })),
            totalRows: methods.count,
            totalPages: totalPages,
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async pagination(param: TPagination): Promise<TableData<IMethod>> {
        let order: Order | undefined;
        if(param.filter){
            const orderBy = param.filter.orderBy ?? "created_at";
            const sortBy = param.filter.sortBy ?? "desc";
            order = [[orderBy, sortBy]];
        }

        const methods = await Method.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalPages = Math.ceil(methods.count / (param.limit || 10));

        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: methods.rows.map((item) => ({
                id: item.id,
                name: item.name,
                no_method: item.no_method,
                file_url: item.file_url,
            })),
            totalRows: methods.count,
            totalPages: totalPages,
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async store(method: EntityMethod): Promise<EntityMethod> {
        const transaction = await sequelize.transaction();
        try {
            const met = await Method.create(
                {
                    id: method.id,
                    name: method.name,
                    no_method: method.no_method,
                    file_url: typeof method.file_url === "string" ? method.file_url : "",
                },
                {
                    transaction,
                }
            );
            await transaction.commit();
            const entity = EntityMethod.create({
                id: met.id,
                name: met.name,
                no_method: met.no_method,
                file_url: met.file_url,
                createdAt: met.created_at,
                updatedAt: met.updated_at,
                deletedAt: met.deleted_at,
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

    async update(method_id: string, methodDomain: IMethod): Promise<EntityMethod> {
        const met = await Method.findByPk(method_id);
        if (!met) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Method was not found",
            });
        }
        await met.update({
            id: methodDomain.id,
            name: methodDomain.name,
            no_method: methodDomain.no_method,
            file_url: methodDomain.file_url?.toString(),
        });
        await met.reload();
        return EntityMethod.create({
            id: met.id,
            name: met.name,
            no_method: met.no_method,
            file_url: met.file_url,
            createdAt: met.created_at,
            updatedAt: met.updated_at,
            deletedAt: met.deleted_at,
        });
    }

    async destroy(method_id: string): Promise<boolean> {
        const p = await Method.findByPk(method_id);

        if (!p) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Method not found",
            });
        }
        await p.destroy();
        return true;
    }
}
