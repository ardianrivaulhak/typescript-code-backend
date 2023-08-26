import { Machine, Line, Position, Manpower } from "@/infrastructure/database/models";
import { Manpower as EntityManpower, IManpower } from "@/domain/models/manpower";
import { Op, Order, Transaction } from "sequelize";
import { sequelize } from "@/infrastructure/database/sequelize";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParam, TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { ManpowerRepository } from "@/domain/service/manpower-repository";

@injectable()
export class ManpowerSequeliezeRepository implements ManpowerRepository {
    async findAll(): Promise<EntityManpower[]> {
        const manpowers = await Manpower.findAll({
            include: [
                {
                    model: Machine,
                    as: "machine",
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: Line,
                        },
                    ],
                },
                {
                    model: Position,
                    as: "position",
                    attributes: ["id", "name"],
                },
            ],
        });

        return manpowers.map((el) =>
            EntityManpower.create({
                id: el.id,
                machineId: el.machineId,
                positionId: el.positionId,
                fullname: el.fullname,
                shortname: el.shortname,
                nip: el.nip,
                machine: el.machine || undefined,
                position: el.position || undefined,
            })
        );
    }

    async findById(manpower_id: string): Promise<EntityManpower> {
        const manpower = await Manpower.findByPk(manpower_id, {
            include: [
                {
                    model: Machine,
                    as: "machine",
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: Line,
                            attributes: ["id", "name"],
                        },
                    ],
                },
                {
                    model: Position,
                    as: "position",
                    attributes: ["id", "name"],
                },
            ],
        });

        if (!manpower) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Manpower not found",
            });
        }

        return EntityManpower.create({
            id: manpower.id,
            machineId: manpower.machineId,
            positionId: manpower.positionId,
            fullname: manpower.fullname,
            shortname: manpower.shortname,
            nip: manpower.nip,
            machine: manpower.machine || undefined,
            position: manpower.position || undefined,
        });
    }
    async getDataTable(param: TDataTableParamFilter): Promise<TableData<IManpower>> {
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

        const whereCondition: any = {
            fullname: {
                [Op.iLike]: `%${param.search || ""}%`,
            },
        };

        const manpower = await Manpower.findAndCountAll({
            attributes: ["id", "machineId", "positionId", "fullname", "shortname", "nip"],
            include: [
                {
                    model: Machine,
                    as: "machine",
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: Line,
                            attributes: ["id", "name"],
                            where: {
                                ...(param.sort_line && { id: param.sort_line }),
                            },
                        },
                    ],
                },
                {
                    model: Position,
                    as: "position",
                    attributes: ["id", "name"],
                    where: {
                        ...(param.sort && { id: param.sort }),
                    },
                },
            ],
            order: order,
            where: whereCondition,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });
        const totalPages = Math.ceil(manpower.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: manpower.rows.map((el) => ({
                id: el.id,
                machineId: el.machineId,
                positionId: el.positionId,
                fullname: el.fullname,
                shortname: el.shortname,
                nip: el.nip,
                machine: el.machine || undefined,
                position: el.position || undefined,
            })),
            totalRows: manpower.count,
            totalPages: Math.ceil(manpower.count / (param.limit || 10)),
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async pagination(param: TPagination): Promise<TableData<IManpower>> {
        let order: Order | undefined;
        if(param.filter){
            const orderBy = param.filter.orderBy ?? "created_at";
            const sortBy = param.filter.sortBy ?? "desc";
            order = [[orderBy, sortBy]];
        }

        const manpowers = await Manpower.findAndCountAll({
            include: [
                {
                    model: Machine,
                    attributes: ["id","name","no_machine"],
                    include:[
                        {
                            model: Line,
                            attributes: ["id","no_line","name"],
                            where: param.line? {
                                id: {
                                    [Op.in]: param.line
                                }
                            } : {},
                        }
                    ]
                },
                {
                    model: Position,
                    attributes: ["id","name"],
                    where: param.position? {
                        id: {
                            [Op.in]: param.position
                        }
                    } : {},
                }
            ],
            where: {
                fullname: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order: order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });
        const totalPages = Math.ceil(manpowers.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: manpowers.rows.map((el) => ({
                id: el.id,
                machineId: el.machineId,
                positionId: el.positionId,
                fullname: el.fullname,
                shortname: el.shortname,
                nip: el.nip,
                machine: el.machine || undefined,
                position: el.position || undefined,
            })),
            totalRows: manpowers.count,
            totalPages: Math.ceil(manpowers.count / (param.limit || 10)),
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }



    async store(_manpower: EntityManpower): Promise<EntityManpower> {
        const t = await sequelize.transaction();

        try {
            const manpower = await Manpower.create(
                {
                    id: _manpower.id,
                    machineId: _manpower.machineId,
                    positionId: _manpower.positionId,
                    fullname: _manpower.fullname,
                    shortname: _manpower.shortname,
                    nip: _manpower.nip,
                },
                { transaction: t }
            );

            await t.commit();

            const entity = EntityManpower.create({
                id: manpower.id,
                machineId: manpower.machineId,
                positionId: manpower.positionId,
                fullname: manpower.fullname,
                shortname: manpower.shortname,
                nip: manpower.nip,
            });

            return entity;
        } catch (e) {
            console.log(e);

            await t.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create manpower",
                error: e,
            });
        }
    }
    async update(manpower_id: string, _manpower: IManpower): Promise<void> {
        const manpower = await Manpower.findByPk(manpower_id);

        if (!manpower) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Manpower not found",
            });
        }

        await manpower.update({
            id: _manpower.id,
            machineId: _manpower.machineId,
            positionId: _manpower.positionId,
            fullname: _manpower.fullname,
            shortname: _manpower.shortname,
            nip: _manpower.nip,
        });
        await manpower.reload();
    }
    async destroy(manpower_id: string): Promise<boolean> {
        const manpower = await Manpower.findByPk(manpower_id);

        if (!manpower) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Manpower not found",
            });
        }
        await manpower.destroy();
        return true;
    }
    async import(manpowers: IManpower[]): Promise<EntityManpower[]> {
        const t = await sequelize.transaction();
        try {
            let createdEntities: EntityManpower[] = [];

            for (const manpower of manpowers) {
                const p = await Manpower.create(
                    {
                        id: manpower.id,
                        machineId: manpower.machineId,
                        positionId: manpower.positionId,
                        fullname: manpower.fullname,
                        shortname: manpower.shortname,
                        nip: manpower.nip,
                    },
                    { transaction: t }
                );

                const entityProblem = EntityManpower.create({
                    id: p.id,
                    machineId: p.machineId,
                    positionId: p.positionId,
                    fullname: p.fullname,
                    shortname: p.shortname,
                    nip: p.nip,
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

    async findAllByMachine(machineId: string): Promise<EntityManpower[]> {
        const manpowers = await Manpower.findAll({
            where: {
                machineId,
            },
            include: {
                model: Position,
            },
        });
        return manpowers.map((el) =>
            EntityManpower.create({
                id: el.id,
                machineId: el.machineId,
                positionId: el.positionId,
                fullname: el.fullname,
                shortname: el.shortname,
                nip: el.nip,
                position: el.position,
            })
        );
    }

    async findByIdCanNull(manpower_id: string, transaction?: Transaction): Promise<EntityManpower | undefined> {
        const manpower = await Manpower.findByPk(manpower_id, { ...(transaction && { transaction }) });
        if (!manpower) return undefined;
        return EntityManpower.create({
            id: manpower.id,
            machineId: manpower.machineId,
            positionId: manpower.positionId,
            fullname: manpower.fullname,
            shortname: manpower.shortname,
            nip: manpower.nip,
        });
    }
}
