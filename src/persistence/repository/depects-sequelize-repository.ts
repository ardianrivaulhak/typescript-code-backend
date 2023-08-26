    import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { Depects } from "@/infrastructure/database/models";
import { DefectsRepository } from "@/domain/service/depects-repository";
import { Defects as EntityDepects, IDefects } from "@/domain/models/defects";
import { Op, Order } from "sequelize";
@injectable()
export class DefectsSequelizeRepository implements DefectsRepository {
    async import(depectss: IDefects[]): Promise<EntityDepects[]> {
        const t = await sequelize.transaction();
        try {
            let createdEntities: EntityDepects[] = [];

            for (const depects of depectss) {
                const p = await Depects.create(
                    {
                        id: depects.id,
                        name: depects.name,
                    },
                    { transaction: t }
                );

                const entityProblem = EntityDepects.create({
                    id: p.id,
                    name: p.name,
                    createdAt: p.created_at,
                    updatedAt: p.updated_at,
                    deletedAt: p.deleted_at,
                });

                createdEntities.push(entityProblem);
            }

            await t.commit();
            return createdEntities;
        } catch (error) {
            await t.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create problem",
                error: error,
            });
        }
    }
    async findAll(): Promise<EntityDepects[]> {
        const depects = await Depects.findAll();
        return depects.map((el) =>
            EntityDepects.create({
                id: el.id,
                name: el.name,
                createdAt: el.created_at,
                updatedAt: el.updated_at,
                deletedAt: el.deleted_at,
            })
        );
    }
    async findById(depects_id: string): Promise<EntityDepects> {
        const depects = await Depects.findByPk(depects_id);

        if (!depects) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Depects not found",
            });
        }

        return EntityDepects.create({
            id: depects.id,
            name: depects.name,
            createdAt: depects.created_at,
            updatedAt: depects.updated_at,
            deletedAt: depects.deleted_at,
        });
    }
    async getDataTable(param: TDataTableParamFilter): Promise<TableData<IDefects>> {
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
        const depects = await Depects.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order: order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalCount = await Depects.count({
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
        });

        const totalPages = Math.ceil(totalCount / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: depects.map((item) => ({
                id: item.id,
                name: item.name,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                deletedAt: item.deleted_at,
            })),
            totalPages: totalPages,
            totalRows: totalCount,
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async pagination(param: TPagination): Promise<TableData<IDefects>> {
        let order: Order | undefined;
        if(param.filter){
            const orderBy = param.filter.orderBy ?? "created_at";
            const sortBy = param.filter.sortBy ?? "desc";
            order = [[orderBy, sortBy]];
        }

        const depects = await Depects.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });
        const totalPages = Math.ceil(depects.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: depects.rows.map((item) => ({
                id: item.id,
                name: item.name,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                deletedAt: item.deleted_at,
            })),
            totalPages: totalPages,
            totalRows: depects.count,
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });

    }

    async store(defects: IDefects): Promise<EntityDepects> {
        const t = await sequelize.transaction();

        try {
            const depects = await Depects.create(
                {
                    id: defects.id,
                    name: defects.name,
                },
                { transaction: t }
            );

            await t.commit();

            const entity = EntityDepects.create({
                id: depects.id,
                name: depects.name,
                createdAt: depects.created_at,
                updatedAt: depects.updated_at,
                deletedAt: depects.deleted_at,
            });

            return entity;
        } catch (e) {
            await t.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create defects",
                error: e,
            });
        }
    }

    async update(depects_id: string, defects: IDefects): Promise<void> {
        const p = await Depects.findByPk(depects_id);

        if (!p) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Depects not found",
            });
        }

        await p.update({
            id: defects.id,
            name: defects.name,
        });
        await p.reload();
    }
    async destroy(depects_id: string): Promise<boolean> {
        const depects = await Depects.findByPk(depects_id);

        if (!depects) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Depects not found",
            });
        }
        await depects.destroy();
        return true;
    }
}
