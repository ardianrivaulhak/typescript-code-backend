import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { Line } from "@/infrastructure/database/models";
import { LineRepository } from "@/domain/service/line-repository";
import { Line as EntityLine, ILine } from "@/domain/models/line";
import { Op, where, Order } from "sequelize";
@injectable()
export class LineSequelizeRepository implements LineRepository {
    async findAll(): Promise<EntityLine[]> {
        const lines = await Line.findAll();
        return lines.map((el) =>
            EntityLine.create({
                id: el.id,
                no_line: el.no_line,
                name: el.name,
                layout_url: el.layout_url,
            })
        );
    }
    async findById(line_id: string): Promise<EntityLine> {
        try {
            const line = await Line.findByPk(line_id);

            if (!line) {
                throw new AppError({
                    statusCode: HttpCode.NOT_FOUND,
                    description: "Line not found",
                });
            }

            await line.save();

            return EntityLine.create({
                id: line.id,
                no_line: line.no_line,
                name: line.name,
                layout_url: line.layout_url,
            });
        } catch (e) {
            console.log(e);
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create line",
                error: e,
            });
        }
    }

    async getDataTable(param: TDataTableParamFilter): Promise<TableData<ILine>> {
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
        const lines = await Line.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order: order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalPages = Math.ceil(lines.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: lines.rows.map((item) => ({
                id: item.id,
                no_line: item.no_line,
                name: item.name,
                layout_url: item.layout_url,
            })),
            totalRows: lines.count,
            totalPages: totalPages,
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async pagination(param: TPagination): Promise<TableData<ILine>> {
        let order: Order | undefined;
        if(param.filter){
            const orderBy = param.filter.orderBy ?? "created_at";
            const sortBy = param.filter.sortBy ?? "desc";
            order = [[orderBy, sortBy]];
        }

        const lines = await Line.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalPages = Math.ceil(lines.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: lines.rows.map((item) => ({
                id: item.id,
                no_line: item.no_line,
                name: item.name,
                layout_url: item.layout_url,
            })),
            totalRows: lines.count,
            totalPages: totalPages,
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async store(line: EntityLine): Promise<EntityLine> {
        const t = await sequelize.transaction();

        try {
            const li = await Line.create(
                {
                    id: line.id,
                    no_line: line.no_line,
                    name: line.name,
                },
                { transaction: t }
            );

            await t.commit();

            const entity = EntityLine.create({
                id: li.id,
                no_line: li.no_line,
                name: li.name,
                layout_url: li.layout_url,
            });

            return entity;
        } catch (e) {
            await t.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create line",
                error: e,
            });
        }
    }

    async storeLayoutUrl(line_id: string, lineDomain: EntityLine): Promise<EntityLine> {
        const user = await Line.findByPk(line_id);
        if (!user) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Line was not found",
            });
        }
        await user.update({
            id: lineDomain.id,
            no_line: lineDomain.no_line,
            name: lineDomain.name,
            layout_url: lineDomain.layout_url?.toString(),
        });
        await user.reload();
        return EntityLine.create({
            id: user.id,
            no_line: user.no_line,
            name: user.name,
            layout_url: user.layout_url?.toString(),
        });
    }

    async update(line_id: string, line: ILine): Promise<void> {
        const li = await Line.findByPk(line_id);

        if (!li) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Line not found",
            });
        }

        await li.update({
            id: line.id,
            no_line: line.no_line,
            name: line.name,
        });
        await li.reload();
    }
    async destroy(line_id: string): Promise<boolean> {
        const line = await Line.findByPk(line_id);

        if (!line) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Depects not found",
            });
        }
        await line.destroy();
        return true;
    }

    async import(lines: ILine[]): Promise<EntityLine[]> {
        const t = await sequelize.transaction();
        try {
            let createdEntities: EntityLine[] = [];

            for (const line of lines) {
                const p = await Line.create(
                    {
                        id: line.id,
                        no_line: line.no_line,
                        name: line.name,
                    },
                    { transaction: t }
                );

                const entityProblem = EntityLine.create({
                    id: p.id,
                    no_line: p.no_line,
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
}
