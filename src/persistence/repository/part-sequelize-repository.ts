import { PartRepository } from "@/domain/service/part-repository";
import { Part, Method, PartHasMethods, Line } from "@/infrastructure/database/models";
import { Part as EntityPart, IPart } from "@/domain/models/part";
import { PartHasMethod as EntityPartHasMethod } from "@/domain/models/part_has_method";

import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParam, TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { Op, Order } from "sequelize";
import { PartUpdateScheme } from "@/presentation/validation/part-validation";

@injectable()
export class PartSequelizeReporsitory implements PartRepository {
    async findAll(): Promise<EntityPart[]> {
        const parts = await Part.findAll({
            include: [
                {
                    model: Method,
                    attributes: ["id", "name", "file_url"],
                    through: {
                        as: "part_has_method",
                        attributes: [],
                    },
                },
                {
                    model: Line,
                    attributes: ["id", "name"],
                },
            ],
        });

        return parts.map((el) =>
            EntityPart.create({
                id: el.id,
                line_id: el.line_id,
                line: el.line || undefined,
                method: el.methods,
                name: el.name,
                no_part: el.no_part,
                cycle_time: el.cycle_time,
            })
        );
    }
    async findById(part_id: string): Promise<EntityPart> {
        const part = await Part.findByPk(part_id, {
            include: [
                {
                    model: Method,
                    attributes: ["id", "name", "file_url"],
                    through: {
                        as: "part_has_method",
                        attributes: [],
                    },
                },
                {
                    model: Line,
                    attributes: ["id", "name"],
                },
            ],
        });

        if (!part) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Part not found",
            });
        }

        return EntityPart.create({
            id: part.id,
            line_id: part.line_id,
            name: part.name,
            no_part: part.no_part,
            cycle_time: part.cycle_time,
            line: part.line || undefined,
            method: part.methods,
        });
    }
    async getDataTable(param: TDataTableParamFilter): Promise<TableData<IPart>> {
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
        const parts = await Part.findAndCountAll({
            include: [
                {
                    model: Method,
                    attributes: ["id", "name", "file_url"],
                    where: {
                        ...(param.sort && { id: param.sort }),
                    },
                    through: {
                        as: "part_has_method",
                        attributes: [],
                    },
                },
                {
                    model: Line,
                    attributes: ["id", "name"],
                    where: {
                        ...(param.sort_line && { id: param.sort_line }),
                    },
                },
            ],
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order: order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalPages = Math.ceil(parts.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: parts.rows.map((el) => ({
                id: el.id,
                line_id: el.line_id,
                name: el.name,
                no_part: el.no_part,
                cycle_time: el.cycle_time,
                line: el.line || undefined,
                method: el.methods,
            })),
            totalRows: parts.count,
            totalPages: Math.ceil(parts.count / (param.limit || 10)),
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async store(part: EntityPart, method_id: string[]): Promise<EntityPart> {
        const t = await sequelize.transaction();
        try {
            const pa = await Part.create(
                {
                    id: part.id,
                    line_id: part.line_id,
                    name: part.name,
                    no_part: part.no_part,
                    cycle_time: part.cycle_time,
                },
                { transaction: t }
            );

            for (let u = 0; u < method_id.length; u++) {
                const d = method_id[u];

                const has = await EntityPartHasMethod.create({
                    part_id: pa.id,
                    method_id: d,
                });

                await PartHasMethods.create(
                    {
                        id: has.id,
                        part_id: has.part_id,
                        method_id: has.method_id,
                    },
                    { transaction: t }
                );
            }

            await t.commit();
            const entity = await EntityPart.create({
                id: pa.id,
                line_id: pa.line_id,
                name: pa.name,
                no_part: pa.no_part,
                cycle_time: pa.cycle_time,
            });

            return entity;
        } catch (e) {
            console.log(e);

            await t.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create machine",
                error: e,
            });
        }
    }

    async update(part_id: string, _part: IPart, _method_id: string[]): Promise<void> {
        const pa = await Part.findByPk(part_id);

        if (!pa) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Part was not found",
            });
        }

        await pa.update({
            id: _part.id,
            line_id: _part.line_id,
            name: _part.name,
            no_part: _part.no_part,
            cycle_time: _part.cycle_time,
        });

        await PartHasMethods.destroy({ where: { part_id: pa.id } });

        for (let u = 0; u < _method_id.length; u++) {
            const d = _method_id[u];

            const has = EntityPartHasMethod.create({
                part_id: pa.id,
                method_id: d,
            });

            await PartHasMethods.create({
                id: has.id,
                part_id: has.part_id,
                method_id: has.method_id,
            });
        }

        console.log("Update process completed.");
    }

    async destroy(part_id: string): Promise<boolean> {
        const p = await Part.findByPk(part_id);

        if (!p) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Part not found",
            });
        }

        await PartHasMethods.destroy({ where: { part_id: p.id } });
        await p.destroy();
        return true;
    }

    async import(parts: IPart[], method_id: string[]): Promise<EntityPart[]> {
        const t = await sequelize.transaction();
        try {
            const createdEntities: EntityPart[] = [];

            for (const part of parts) {
                const p = await Part.create(
                    {
                        id: part.id,
                        line_id: part.line_id,
                        name: part.name,
                        no_part: part.no_part,
                        cycle_time: part.cycle_time,
                    },
                    { transaction: t }
                );

                const entityPart = EntityPart.create({
                    id: p.id,
                    line_id: p.line_id,
                    name: p.name,
                    no_part: p.no_part,
                    cycle_time: p.cycle_time,
                });

                for (let u = 0; u < method_id.length; u++) {
                    const d = method_id[u];

                    const has = await EntityPartHasMethod.create({
                        part_id: p.id,
                        method_id: d,
                    });

                    await PartHasMethods.create(
                        {
                            id: has.id,
                            part_id: has.part_id,
                            method_id: has.method_id,
                        },
                        { transaction: t }
                    );
                }

                createdEntities.push(entityPart);
            }

            await t.commit();
            return createdEntities;
        } catch (error) {
            await t.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create parts",
                error: error,
            });
        }
    }

    async pagination(param: TPagination): Promise<TableData<IPart>>{
        let order: Order | undefined;
        if(param.filter){
            const orderBy = param.filter.orderBy ?? "created_at";
            const sortBy = param.filter.sortBy ?? "desc";
            order = [[orderBy, sortBy]];
        }

        const parts = await Part.findAndCountAll({
            include: [
                {
                    model: Method,
                    attributes: ["id", "name"],
                    where: param.method? {
                        id: {
                            [Op.in]: param.method
                        }
                    } : {},
                    through: {
                        as: "part_has_method",
                        attributes: [],
                    },
                },
                {
                    model: Line,
                    attributes: ["id", "name","no_line"],
                    where: param.line? {
                        id: {
                            [Op.in]: param.line
                        }
                    } : {},    
                }
            ],
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalPages = Math.ceil(parts.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: parts.rows.map((el) => ({
                id: el.id,
                line_id: el.line_id,
                name: el.name,
                no_part: el.no_part,
                cycle_time: el.cycle_time,
                line: el.line || undefined,
                method: el.methods,
            })),
            totalRows: parts.count,
            totalPages: Math.ceil(parts.count / (param.limit || 10)),
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }
}
