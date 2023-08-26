import { Task as EntityTask, ITask } from "@/domain/models/task";
import { TaskRepository } from "@/domain/service/task-repository";
import { ProductionEquipment, ProductionManpower, ProductionOrder } from "@/infrastructure/database/models";
import { Task } from "@/infrastructure/database/models/task-sequelize";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import moment from "moment";
import { Op } from "sequelize";

@injectable()
export class TaskSequelizeRepository implements TaskRepository {
    async findAll(): Promise<EntityTask[]> {
        const data = await Task.findAll();
        return data.map((item) => {
            return EntityTask.create({
                shiftId: item.shiftId ?? "",
                machineId: item.machineId ?? "",
                date: item.date,
                status: item.status,
            });
        });
    }

    async store(data: ITask): Promise<EntityTask> {
        try {
            const { id, date, status, machineId, shiftId } = data;
            const task = await Task.create({
                id,
                date,
                status,
                machineId,
                shiftId,
            });
            const entity = EntityTask.create({
                id: task.id,
                date: task.date,
                status: task.status,
                machineId: task.machineId,
                shiftId: task.shiftId,
            });
            return entity;
        } catch (error) {
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create user",
                error,
            });
        }
    }

    async findRunning(shiftId: string): Promise<EntityTask | undefined> {
        const date = moment();
        const task = await Task.findOne({
            where: {
                date: {
                    [Op.between]: [date.startOf("day").toDate(), date.endOf("day").toDate()],
                },
                status: "running",
                shiftId,
            },
        });
        if (!task) return undefined;
        return EntityTask.create({
            id: task.id,
            date: task.date,
            status: task.status,
            machineId: task.machineId,
            shiftId: task.shiftId,
        });
    }

    async findRunningComplete(shiftId: string, machineId: string): Promise<EntityTask | undefined> {
        const date = moment();
        const task = await Task.findOne({
            where: {
                date: {
                    [Op.between]: [date.startOf("day").toDate(), date.endOf("day").toDate()],
                },
                status: "running",
                shiftId,
            },
            include: [
                {
                    model: ProductionOrder,
                    as: "productionOrders",
                },
                {
                    model: ProductionEquipment,
                    as: "productionEquipments",
                },
                {
                    model: ProductionManpower,
                    as: "productionManpowers",
                },
            ],
        });
        if (!task) return undefined;
        return EntityTask.create({
            id: task.id,
            date: task.date,
            status: task.status,
            machineId: task.machineId,
            shiftId: task.shiftId,
            productionOrders: task.productionOrders,
            productionEquipments: task.productionEquipments,
            productionManpowers: task.productionManpowers,
        });
    }
}
