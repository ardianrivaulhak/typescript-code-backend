import { PreparationTimeLogRepository } from "@/domain/service/preparation-time-log-repository";
import { PreparationTimeLog } from "@/infrastructure/database/models";
import { PreparationTimeLog as EntityPreparationTimeLog, IPreparationTimeLog } from "@/domain/models/preparation-time-log";
import { injectable } from "inversify";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import moment from "moment";
import { Op, Transaction } from "sequelize";

@injectable()
export class PreparationTimeLogSequelizeRepository implements PreparationTimeLogRepository {
    async store(domain: EntityPreparationTimeLog): Promise<IPreparationTimeLog> {
        const data = await PreparationTimeLog.create({
            id: domain.id,
            taskId: domain.taskId,
            startTime: domain.startTime,
        });
        return EntityPreparationTimeLog.create({
            id: data.id,
            taskId: data.taskId,
            startTime: data.startTime,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
        });
    }

    async update(preparationTimeLogId: string, domain: EntityPreparationTimeLog): Promise<IPreparationTimeLog> {
        const timeLog = await PreparationTimeLog.findByPk(preparationTimeLogId);
        if (!timeLog) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Preparation log not found",
            });
        }
        await timeLog.update(domain.unmarshal());
        await timeLog.reload();
        return EntityPreparationTimeLog.create({
            id: timeLog.id,
            taskId: timeLog.taskId,
            startTime: timeLog.startTime,
            finishTime: timeLog.finishTime,
            createdAt: timeLog.createdAt,
            updatedAt: timeLog.updatedAt,
            deletedAt: timeLog.deletedAt,
        });
    }

    async updateFinish(taskId: string, transaction: Transaction): Promise<IPreparationTimeLog> {
        const timeLog = await PreparationTimeLog.findOne({
            where: {
                taskId,
                finishTime: {
                    [Op.is]: null,
                },
            },
            ...(transaction && { transaction }),
        });
        if (!timeLog) {
            if (transaction) await transaction.rollback();
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Preparation log not found",
            });
        }
        await timeLog.update(
            {
                finishTime: moment().toDate(),
            },
            { ...(transaction && { transaction }) }
        );
        await timeLog.reload({ ...(transaction && { transaction }) });
        return EntityPreparationTimeLog.create({
            id: timeLog.id,
            taskId: timeLog.taskId,
            startTime: timeLog.startTime,
            finishTime: timeLog.finishTime,
            createdAt: timeLog.createdAt,
            updatedAt: timeLog.updatedAt,
            deletedAt: timeLog.deletedAt,
        }).unmarshal();
    }
}
