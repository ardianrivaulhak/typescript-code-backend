import { ProductionOrderRepository } from "@/domain/service/production-order-repository";
import { Equipment, Material, Part, ProductionOrder, Schedule } from "@/infrastructure/database/models";
import { ProductionOrder as EntityPO, IProductionOrder } from "@/domain/models/production_order";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParam } from "@/domain/service/types";
import { Op, Transaction } from "sequelize";

@injectable()
export class ProductionOrderSequelizeRepository implements ProductionOrderRepository {
    async getDataTable(param: TDataTableParam): Promise<TableData<IProductionOrder>> {
        const po = await ProductionOrder.findAll({
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });
        const totalPages = Math.ceil(po.length / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: po.map((item) => {
                return {
                    id: item.id,
                    taskId: item.taskId,
                    scheduleId: item.scheduleId,
                    partId: item.partId,
                    actualLineId: item.actualLineId,
                    qty: item.qty,
                    purpose: item.purpose,
                    startTime: item.startTime,
                    finishTime: item.finishTime,
                    status: item.status,
                    actualOutput: item.actualOutput,
                    ngCount: item.ngCount,
                    cycleTime: item.cycleTime,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    deletedAt: item.deletedAt,
                };
            }),
            totalPages: po.length,
            totalRows: Math.ceil(po.length / (param.limit || 10)),
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }
    async findAll(): Promise<EntityPO[]> {
        const po = await ProductionOrder.findAll({
            attributes: ["id", "name"],
        });
        return po.map((item) =>
            EntityPO.create({
                id: item.id,
                taskId: item.taskId,
                scheduleId: item.scheduleId,
                partId: item.partId,
                actualLineId: item.actualLineId,
                qty: item.qty,
                purpose: item.purpose,
                startTime: item.startTime,
                finishTime: item.finishTime,
                status: item.status,
                actualOutput: item.actualOutput,
                ngCount: item.ngCount,
                cycleTime: item.cycleTime,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                deletedAt: item.deletedAt,
            })
        );
    }
    async findAllWithSchedulePartByTaskId(taskId: string): Promise<EntityPO[]> {
        const po = await ProductionOrder.findAll({
            where: {
                taskId,
                status: "pending",
            },
            include: [
                {
                    model: Schedule,
                    include: [
                        {
                            model: Part,
                        },
                    ],
                },
                {
                    model: Part,
                },
            ],
        });
        return po.map((item) =>
            EntityPO.create({
                id: item.id,
                taskId: item.taskId,
                scheduleId: item.scheduleId,
                partId: item.partId,
                actualLineId: item.actualLineId,
                qty: item.qty,
                purpose: item.purpose,
                startTime: item.startTime,
                finishTime: item.finishTime,
                status: item.status,
                actualOutput: item.actualOutput,
                ngCount: item.ngCount,
                part: item.part,
                schedule: item.schedule,
                cycleTime: item.cycleTime,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                deletedAt: item.deletedAt,
            })
        );
    }
    async findAllWithSchedulePartByTaskIdBulk(taskId: string[]): Promise<EntityPO[]> {
        const po = await ProductionOrder.findAll({
            where: {
                taskId: {
                    [Op.in]: taskId
                },
            },
            include: [
                {
                    model: Schedule,
                    include: [
                        {
                            model: Part,
                        },
                    ],
                },
                {
                    model: Part,
                },
            ],
        });
        return po.map((item) =>
            EntityPO.create({
                id: item.id,
                taskId: item.taskId,
                scheduleId: item.scheduleId,
                partId: item.partId,
                actualLineId: item.actualLineId,
                qty: item.qty,
                purpose: item.purpose,
                startTime: item.startTime,
                finishTime: item.finishTime,
                status: item.status,
                actualOutput: item.actualOutput,
                ngCount: item.ngCount,
                part: item.part,
                schedule: item.schedule,
                cycleTime: item.cycleTime,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                deletedAt: item.deletedAt,
            })
        );
    }
    async findById(id: string): Promise<EntityPO> {
        const po = await ProductionOrder.findByPk(id);
        if (!po) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "ProductionOrder was not found",
            });
        }
        return EntityPO.create({
            id: po.id,
            taskId: po.taskId,
            scheduleId: po.scheduleId,
            partId: po.partId,
            actualLineId: po.actualLineId,
            qty: po.qty,
            purpose: po.purpose,
            startTime: po.startTime,
            finishTime: po.finishTime,
            status: po.status,
            actualOutput: po.actualOutput,
            ngCount: po.ngCount,
            cycleTime: po.cycleTime,
            createdAt: po.createdAt,
            updatedAt: po.updatedAt,
            deletedAt: po.deletedAt,
        });
    }

    async findByIdWithScheduleAndPart(id: string): Promise<EntityPO> {
        const po = await ProductionOrder.findByPk(id, {
            include: [
                {
                    model: Schedule,
                    include: [
                        {
                            model: Part,
                        },
                    ],
                },
                {
                    model: Part,
                },
            ]
        });
        if (!po) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "ProductionOrder was not found",
            });
        }
        return EntityPO.create({
            id: po.id,
            taskId: po.taskId,
            scheduleId: po.scheduleId,
            partId: po.partId,
            actualLineId: po.actualLineId,
            qty: po.qty,
            purpose: po.purpose,
            startTime: po.startTime,
            finishTime: po.finishTime,
            status: po.status,
            actualOutput: po.actualOutput,
            ngCount: po.ngCount,
            cycleTime: po.cycleTime,
            part: po.part,
            schedule: po.schedule,
        });
    }

    async findByIdCanNull(id: string, transaction: Transaction): Promise<EntityPO | undefined> {
        const po = await ProductionOrder.findByPk(id, { transaction });
        if (!po) {
            return undefined;
        }
        return EntityPO.create({
            id: po.id,
            taskId: po.taskId,
            scheduleId: po.scheduleId,
            partId: po.partId,
            actualLineId: po.actualLineId,
            qty: po.qty,
            purpose: po.purpose,
            startTime: po.startTime,
            finishTime: po.finishTime,
            status: po.status,
            actualOutput: po.actualOutput,
            ngCount: po.ngCount,
            cycleTime: po.cycleTime,
            createdAt: po.createdAt,
            updatedAt: po.updatedAt,
            deletedAt: po.deletedAt,
        });
    }

    async store(poDomain: EntityPO): Promise<EntityPO> {
        const transaction = await sequelize.transaction();
        try {
            const po = await ProductionOrder.create(
                {
                    id: poDomain.id,
                    taskId: poDomain.taskId,
                    scheduleId: poDomain.scheduleId,
                    partId: poDomain.partId,
                    actualLineId: poDomain.actualLineId,
                    qty: poDomain.qty,
                    purpose: poDomain.purpose,
                    startTime: poDomain.startTime,
                    finishTime: poDomain.finishTime,
                    status: poDomain.status,
                    actualOutput: poDomain.actualOutput,
                    ngCount: poDomain.ngCount,
                    cycleTime: poDomain.cycleTime,
                    createdAt: poDomain.createdAt,
                    updatedAt: poDomain.updatedAt,
                    deletedAt: poDomain.deletedAt,
                },
                {
                    transaction,
                }
            );
            await transaction.commit();
            const entity = EntityPO.create({
                id: po.id,
                taskId: po.taskId,
                scheduleId: po.scheduleId,
                partId: po.partId,
                actualLineId: po.actualLineId,
                qty: po.qty,
                purpose: po.purpose,
                startTime: po.startTime,
                finishTime: po.finishTime,
                status: po.status,
                actualOutput: po.actualOutput,
                ngCount: po.ngCount,
                cycleTime: po.cycleTime,
                createdAt: po.createdAt,
                updatedAt: po.updatedAt,
                deletedAt: po.deletedAt,
            });
            return entity;
        } catch (e) {
            await transaction.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create po",
                error: e,
            });
        }
    }

    async storeTransaction(poDomain: EntityPO, transaction: Transaction): Promise<EntityPO> {
        try {
            await ProductionOrder.create(
                {
                    id: poDomain.id,
                    taskId: poDomain.taskId,
                    scheduleId: poDomain.scheduleId,
                    partId: poDomain.partId,
                    actualLineId: poDomain.actualLineId,
                    qty: poDomain.qty,
                    purpose: poDomain.purpose,
                    startTime: poDomain.startTime,
                    finishTime: poDomain.finishTime,
                    status: poDomain.status,
                    actualOutput: poDomain.actualOutput,
                    ngCount: poDomain.ngCount,
                    cycleTime: poDomain.cycleTime,
                    createdAt: poDomain.createdAt,
                    updatedAt: poDomain.updatedAt,
                    deletedAt: poDomain.deletedAt,
                },
                {
                    transaction,
                }
            );
            const entity = EntityPO.create({
                id: poDomain.id,
                taskId: poDomain.taskId,
                scheduleId: poDomain.scheduleId,
                partId: poDomain.partId,
                actualLineId: poDomain.actualLineId,
                qty: poDomain.qty,
                purpose: poDomain.purpose,
                startTime: poDomain.startTime,
                finishTime: poDomain.finishTime,
                status: poDomain.status,
                actualOutput: poDomain.actualOutput,
                ngCount: poDomain.ngCount,
                cycleTime: poDomain.cycleTime,
                createdAt: poDomain.createdAt,
                updatedAt: poDomain.updatedAt,
                deletedAt: poDomain.deletedAt,
            });
            return entity;
        } catch (e) {
            await transaction.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create po",
                error: e,
            });
        }
    }

    async update(id: string, poDomain: EntityPO): Promise<EntityPO> {
        const po = await ProductionOrder.findByPk(id);
        if (!po) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "ProductionOrder was not found",
            });
        }
        await po.update({
            taskId: poDomain.taskId,
            scheduleId: poDomain.scheduleId,
            partId: poDomain.partId,
            actualLineId: poDomain.actualLineId,
            qty: poDomain.qty,
            purpose: poDomain.purpose,
            startTime: poDomain.startTime,
            finishTime: poDomain.finishTime,
            status: poDomain.status,
            actualOutput: poDomain.actualOutput,
            ngCount: poDomain.ngCount,
            cycleTime: poDomain.cycleTime,
            createdAt: poDomain.createdAt,
            updatedAt: poDomain.updatedAt,
            deletedAt: poDomain.deletedAt,
        });
        await po.reload();
        return EntityPO.create({
            id: po.id,
            taskId: po.taskId,
            scheduleId: po.scheduleId,
            partId: po.partId,
            actualLineId: po.actualLineId,
            qty: po.qty,
            purpose: po.purpose,
            startTime: po.startTime,
            finishTime: po.finishTime,
            status: po.status,
            actualOutput: po.actualOutput,
            ngCount: po.ngCount,
            cycleTime: po.cycleTime,
            createdAt: po.createdAt,
            updatedAt: po.updatedAt,
            deletedAt: po.deletedAt,
        });
    }

    async destroy(id: string): Promise<boolean> {
        const po = await ProductionOrder.findByPk(id);
        if (!po) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "ProductionOrder was not found",
            });
        }
        await po.destroy();
        return true;
    }

    async findCurrentManualPending(taskId: string): Promise<EntityPO[]> {
        const po = await ProductionOrder.findAll({
            where: {
                taskId,
                scheduleId: {
                    [Op.is]: null,
                },
            },
            include: {
                model: Part,
            },
        });
        return po.map((item) =>
            EntityPO.create({
                id: item.id,
                taskId: item.taskId,
                scheduleId: item.scheduleId,
                partId: item.partId,
                actualLineId: item.actualLineId,
                qty: item.qty,
                purpose: item.purpose,
                startTime: item.startTime,
                finishTime: item.finishTime,
                status: item.status,
                actualOutput: item.actualOutput,
                ngCount: item.ngCount,
                cycleTime: item.cycleTime,
                part: item.part,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                deletedAt: item.deletedAt,
            })
        );
    }

    async findRunning(taskId: string): Promise<EntityPO | undefined> {
        const po = await ProductionOrder.findOne({
            where: {
                taskId,
                status: "running",
            },
            include: {
                model: Part,
            },
        });
        if (!po) return undefined;
        return EntityPO.create({
            id: po.id,
            taskId: po.taskId,
            scheduleId: po.scheduleId,
            partId: po.partId,
            actualLineId: po.actualLineId,
            qty: po.qty,
            purpose: po.purpose,
            startTime: po.startTime,
            finishTime: po.finishTime,
            status: po.status,
            actualOutput: po.actualOutput,
            ngCount: po.ngCount,
            cycleTime: po.cycleTime,
            part: po.part,
        });
    }

    async findRunningWithEquipment(taskId: string): Promise<IProductionOrder[]> {
        const po = await ProductionOrder.findAll({
            where: {
                taskId,
                // status: "running",
            },
            include: [
                {
                    model: Part,
                    attributes: ["id", "no_part", "name"],
                    include: [
                        {
                            model: Equipment,
                            attributes: ["id", "part_id", "name", "no_equipment"],
                        },
                    ],
                },
                {
                    model: Schedule,
                    include: [
                        {
                            model: Part,
                            attributes: ["id", "no_part", "name"],
                            include: [
                                {
                                    model: Equipment,
                                    attributes: ["id", "part_id", "name", "no_equipment"],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        return po.map((el) => {
            return {
                id: el.id,
                taskId: el.taskId,
                scheduleId: el.scheduleId,
                partId: el.partId,
                actualLineId: el.actualLineId,
                qty: el.qty,
                purpose: el.purpose,
                startTime: el.startTime,
                finishTime: el.finishTime,
                status: el.status,
                actualOutput: el.actualOutput,
                ngCount: el.ngCount,
                cycleTime: el.cycleTime,
                part: el.part,
                schedule: el.schedule,
            };
        });
    }

    async findRunningWithMaterial(taskId: string): Promise<IProductionOrder[]> {
        const po = await ProductionOrder.findAll({
            where: {
                taskId,
            },
            include: [
                {
                    model: Part,
                    include: [
                        {
                            model: Material,
                        },
                    ],
                },
                {
                    model: Schedule,
                    include: [
                        {
                            model: Part,
                            include: [
                                {
                                    model: Material,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        return po.map((el) => {
            return {
                id: el.id,
                taskId: el.taskId,
                scheduleId: el.scheduleId,
                partId: el.partId,
                actualLineId: el.actualLineId,
                qty: el.qty,
                purpose: el.purpose,
                startTime: el.startTime,
                finishTime: el.finishTime,
                status: el.status,
                actualOutput: el.actualOutput,
                ngCount: el.ngCount,
                cycleTime: el.cycleTime,
                part: el.part,
                schedule: el.schedule,
            };
        });
    }
}
