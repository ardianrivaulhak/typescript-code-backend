import { Part, Schedule } from "@/infrastructure/database/models";
import { Schedule as EntitySchedule, ISchedule } from "@/domain/models/schedule";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParam } from "@/domain/service/types";
import { Op, Transaction } from "sequelize";
import { ScheduleRepository } from "@/domain/service/schedule-repository";
import moment from "moment";

@injectable()
export class ScheduleSequelizeReporsitory implements ScheduleRepository {
    async getDataTable(param: TDataTableParam): Promise<TableData<ISchedule>> {
        const schedules = await Schedule.findAll({
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });
        const totalPages = Math.ceil(schedules.length / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: schedules.map((item) => {
                return {
                    id: item.id,
                    partId: item.partId,
                    lineId: item.lineId,
                    poNumber: item.poNumber,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    qty: item.qty,
                    balance: item.balance,
                    status: item.status,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    deletedAt: item.deletedAt,
                };
            }),
            totalPages: schedules.length,
            totalRows: Math.ceil(schedules.length / (param.limit || 10)),
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }
    async findAll(): Promise<EntitySchedule[]> {
        const schedules = await Schedule.findAll({
            attributes: ["id", "name"],
        });
        return schedules.map((item) =>
            EntitySchedule.create({
                id: item.id,
                partId: item.partId,
                lineId: item.lineId,
                poNumber: item.poNumber,
                startDate: item.startDate,
                endDate: item.endDate,
                qty: item.qty,
                balance: item.balance,
                status: item.status,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                deletedAt: item.deletedAt,
            })
        );
    }

    async findById(id: string): Promise<EntitySchedule> {
        const item = await Schedule.findByPk(id);
        if (!item) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Schedule was not found",
            });
        }
        return EntitySchedule.create({
            id: item.id,
            partId: item.partId,
            lineId: item.lineId,
            poNumber: item.poNumber,
            startDate: item.startDate,
            endDate: item.endDate,
            qty: item.qty,
            balance: item.balance,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            deletedAt: item.deletedAt,
        });
    }

    async findByIdCanNull(id: string, transaction: Transaction): Promise<EntitySchedule | undefined> {
        const item = await Schedule.findByPk(id, { transaction });
        if (!item) {
            return undefined;
        }
        return EntitySchedule.create({
            id: item.id,
            partId: item.partId,
            lineId: item.lineId,
            poNumber: item.poNumber,
            startDate: item.startDate,
            endDate: item.endDate,
            qty: item.qty,
            balance: item.balance,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            deletedAt: item.deletedAt,
        });
    }

    async store(scheduleDomain: EntitySchedule): Promise<EntitySchedule> {
        const transaction = await sequelize.transaction();
        try {
            const item = await Schedule.create(
                {
                    id: scheduleDomain.id,
                    partId: scheduleDomain.partId,
                    lineId: scheduleDomain.lineId,
                    poNumber: scheduleDomain.poNumber,
                    startDate: scheduleDomain.startDate,
                    endDate: scheduleDomain.endDate,
                    qty: scheduleDomain.qty,
                    balance: scheduleDomain.balance,
                    status: scheduleDomain.status,
                },
                {
                    transaction,
                }
            );
            await transaction.commit();
            const entity = EntitySchedule.create({
                id: item.id,
                partId: item.partId,
                lineId: item.lineId,
                poNumber: item.poNumber,
                startDate: item.startDate,
                endDate: item.endDate,
                qty: item.qty,
                balance: item.balance,
                status: item.status,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                deletedAt: item.deletedAt,
            });
            return entity;
        } catch (e) {
            await transaction.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create item",
                error: e,
            });
        }
    }

    async update(id: string, scheduleDomain: EntitySchedule): Promise<EntitySchedule> {
        const item = await Schedule.findByPk(id);
        if (!item) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Schedule was not found",
            });
        }
        await item.update({
            poNumber: scheduleDomain.poNumber,
            startDate: scheduleDomain.startDate,
            endDate: scheduleDomain.endDate,
            qty: scheduleDomain.qty,
            balance: scheduleDomain.balance,
            status: scheduleDomain.status,
        });
        await item.reload();
        return EntitySchedule.create({
            id: item.id,
            partId: item.partId,
            lineId: item.lineId,
            poNumber: item.poNumber,
            startDate: item.startDate,
            endDate: item.endDate,
            qty: item.qty,
            balance: item.balance,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            deletedAt: item.deletedAt,
        });
    }

    async updateTransaction(id: string, scheduleDomain: EntitySchedule, transaction: Transaction): Promise<EntitySchedule | undefined> {
        const item = await Schedule.findByPk(id, { transaction });
        if (!item) {
            return undefined;
        }
        await item.update(
            {
                poNumber: scheduleDomain.poNumber,
                startDate: scheduleDomain.startDate,
                endDate: scheduleDomain.endDate,
                qty: scheduleDomain.qty,
                balance: scheduleDomain.balance,
                status: scheduleDomain.status,
            },
            { transaction }
        );
        await item.reload();
        return EntitySchedule.create({
            id: item.id,
            partId: item.partId,
            lineId: item.lineId,
            poNumber: item.poNumber,
            startDate: item.startDate,
            endDate: item.endDate,
            qty: item.qty,
            balance: item.balance,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            deletedAt: item.deletedAt,
        });
    }

    async destroy(id: string): Promise<boolean> {
        const item = await Schedule.findByPk(id);
        if (!item) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Schedule was not found",
            });
        }
        await item.destroy();
        return true;
    }

    async findToday(): Promise<EntitySchedule[]> {
        const date = moment().endOf("day").toDate();
        const schedules = await Schedule.findAll({
            include: {
                model: Part,
            },
            where: {
                status: "open",
                startDate: {
                    [Op.lte]: date,
                },
            },
        });
        return schedules.map((item) =>
            EntitySchedule.create({
                id: item.id,
                partId: item.partId,
                lineId: item.lineId,
                poNumber: item.poNumber,
                startDate: item.startDate,
                endDate: item.endDate,
                qty: item.qty,
                balance: item.balance,
                status: item.status,
                part: item.part,
            })
        );
    }
}
