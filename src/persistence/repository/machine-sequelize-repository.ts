import { Machine, Line } from "@/infrastructure/database/models";
import { Machine as EntityMachine, IMachine } from "@/domain/models/machine";
import { Op, Order, Sequelize, OrderItem } from "sequelize";
import { sequelize } from "@/infrastructure/database/sequelize";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { MachineRepository } from "@/domain/service/machine-repository";

@injectable()
export class MachineSequeliezeRepository implements MachineRepository {
    async findAll(): Promise<EntityMachine[]> {
        const machines = await Machine.findAll({
            attributes: ["id", "no_machine", "name", "line_id"],
            include: [
                {
                    model: Line,
                    attributes: ["id", "no_line", "name"],
                },
            ],
        });

        return machines.map((el) => {
            return EntityMachine.create({
                id: el.id,
                no_machine: el.no_machine,
                name: el.name,
                line_id: el.line_id,
                line: el.line || undefined,
            });
        }) as EntityMachine[];
    }
    async findById(machine_id: string): Promise<EntityMachine> {
        const machine = await Machine.findByPk(machine_id, {
            attributes: ["id", "no_machine", "name", "line_id"],
            include: [
                {
                    model: Line,
                    attributes: ["id", "no_line", "name"],
                },
            ],
        });

        if (!machine) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Machine not found",
            });
        }

        return EntityMachine.create({
            id: machine.id,
            no_machine: machine.no_machine,
            name: machine.name,
            line_id: machine.line_id,
            line: machine.line || undefined,
        });
    }
    async getDataTable(param: TDataTableParamFilter): Promise<TableData<IMachine>> {
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

        const machines = await Machine.findAndCountAll({
            attributes: ["id", "no_machine", "name", "line_id"],
            include: [
                {
                    model: Line,
                    attributes: ["id", "no_line", "name"],
                    where: {
                        ...(param.sort_line && { id: param.sort_line }),
                    },
                },
            ],
            where: {
                [Op.and]: [
                    {
                        name: {
                            [Op.iLike]: `%${param.search || ""}%`,
                        },
                    },
                ],
            },
            order: order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalRows = machines.count;
        const totalPages = Math.ceil(totalRows / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: machines.rows.map((el) => ({
                id: el.id,
                no_machine: el.no_machine,
                name: el.name,
                line_id: el.line_id,
                line: el.line || undefined,
            })),
            totalRows: totalRows,
            totalPages: totalPages,
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async pagination(param: TPagination): Promise<TableData<IMachine>> {
        let order: Order | undefined;
        if(param.filter){
            const orderBy = param.filter.orderBy ?? "created_at";
            const sortBy = param.filter.sortBy ?? "desc";
            order = [[orderBy, sortBy]];
        }

        const machines = await Machine.findAndCountAll({
            include: [
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

        const totalRows = machines.count;
        const totalPages = Math.ceil(totalRows / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: machines.rows.map((el) => ({
                id: el.id,
                no_machine: el.no_machine,
                name: el.name,
                line_id: el.line_id,
                line: el.line || undefined,
            })),
            totalRows: totalRows,
            totalPages: totalPages,
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
        
    }

    async store(machine: EntityMachine): Promise<EntityMachine> {
        const t = await sequelize.transaction();

        try {
            const machin = await Machine.create(
                {
                    id: machine.id,
                    no_machine: machine.no_machine,
                    name: machine.name,
                    line_id: machine.line_id,
                },
                { transaction: t }
            );

            await t.commit();

            const entity = EntityMachine.create({
                id: machin.id,
                no_machine: machin.no_machine,
                name: machin.name,
                line_id: machin.line_id,
                createdAt: machin.created_at,
                updatedAt: machin.updated_at,
                deletedAt: machin.deleted_at,
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
    async update(machine_id: string, machine: IMachine): Promise<void> {
        const machin = await Machine.findByPk(machine_id);

        if (!machin) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Depects not found",
            });
        }

        await machin.update({
            id: machine.id,
            name: machine.name,
        });
        await machin.reload();
    }
    async destroy(machine_id: string): Promise<boolean> {
        const machine = await Machine.findByPk(machine_id);

        if (!machine) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Depects not found",
            });
        }
        await machine.destroy();
        return true;
    }
    async import(machines: IMachine[]): Promise<EntityMachine[]> {
        const t = await sequelize.transaction();
        try {
            let createdEntities: EntityMachine[] = [];

            for (const machine of machines) {
                const p = await Machine.create(
                    {
                        id: machine.id,
                        no_machine: machine.no_machine,
                        name: machine.name,
                        line_id: machine.line_id,
                    },
                    { transaction: t }
                );

                const entityProblem = EntityMachine.create({
                    id: p.id,
                    no_machine: p.no_machine,
                    name: p.name,
                    line_id: p.line_id,
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
