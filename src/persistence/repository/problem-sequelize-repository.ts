import { Problem } from "@/infrastructure/database/models";
import { ProblemRepository } from "@/domain/service/problem-repository";
import { Problem as EntityProblem, IProblem } from "@/domain/models/problem";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { Op, Order } from "sequelize";

@injectable()
export class ProblemSequelizeRepository implements ProblemRepository {
    async import(problems: IProblem[]): Promise<EntityProblem[]> {
        const t = await sequelize.transaction();
        try {
            let createdEntities: EntityProblem[] = [];

            for (const problem of problems) {
                const p = await Problem.create(
                    {
                        id: problem.id,
                        name: problem.name,
                    },
                    { transaction: t }
                );

                const entityProblem = EntityProblem.create({
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
    async findAll(): Promise<EntityProblem[]> {
        const p = await Problem.findAll();

        return p.map((el) =>
            EntityProblem.create({
                id: el.id,
                name: el.name,
                createdAt: el.created_at,
                updatedAt: el.updated_at,
                deletedAt: el.deleted_at,
            })
        );
    }
    async findById(problem_id: string): Promise<EntityProblem> {
        const p = await Problem.findByPk(problem_id);

        if (!p) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Problem not found",
            });
        }

        return EntityProblem.create({
            id: p.id,
            name: p.name,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            deletedAt: p.deleted_at,
        });
    }
    async getDataTable(param: TDataTableParamFilter): Promise<TableData<IProblem>> {
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
        const { rows: problem, count: totalCount } = await Problem.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order: order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalPages = Math.ceil(totalCount / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: problem.map((item) => ({
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

    async pagination(param: TPagination): Promise<TableData<IProblem>> {
        let order: Order | undefined;
        if(param.filter){
            const orderBy = param.filter.orderBy ?? "created_at";
            const sortBy = param.filter.sortBy ?? "desc";
            order = [[orderBy, sortBy]];
        }

        const problems = await Problem.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalPages = Math.ceil(problems.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: problems.rows.map((item) => ({
                id: item.id,
                name: item.name,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                deletedAt: item.deleted_at,
            })),
            totalPages: totalPages,
            totalRows: problems.count,
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async store(problem: IProblem): Promise<EntityProblem> {
        const t = await sequelize.transaction();

        try {
            const p = await Problem.create(
                {
                    id: problem.id,
                    name: problem.name,
                },
                { transaction: t }
            );

            await t.commit();

            const entity = EntityProblem.create({
                id: p.id,
                name: p.name,
                createdAt: p.created_at,
                updatedAt: p.updated_at,
                deletedAt: p.deleted_at,
            });

            return entity;
        } catch (e) {
            await t.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create problem",
                error: e,
            });
        }
    }
    async update(problem_id: string, problem: IProblem): Promise<void> {
        const p = await Problem.findByPk(problem_id);

        if (!p) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Problem not found",
            });
        }

        await p.update({
            id: problem.id,
            name: problem.name,
        });
        await p.reload();
    }
    async destroy(problem_id: string): Promise<boolean> {
        const p = await Problem.findByPk(problem_id);

        if (!p) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Problem not found",
            });
        }
        await p.destroy();
        return true;
    }
}
