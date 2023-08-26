import { MethodLog } from "@/infrastructure/database/models";
import { MethodLog as EntityMethodLog, IMethodLog } from "@/domain/models/method-log";
import { injectable } from "inversify";
import { MethodLogRepository } from "@/domain/service/method-log-repository";

@injectable()
export class MethodLogSequelizeRepository implements MethodLogRepository {
    async store(domain: EntityMethodLog): Promise<IMethodLog> {
        const data = await MethodLog.create({
            id: domain.id,
            taskId: domain.taskId,
            reportBy: domain.reportBy,
            remark: domain.remark,
            logTime: domain.logTime,
        });
        return EntityMethodLog.create({
            id: data.id,
            taskId: data.taskId,
            reportBy: data.reportBy,
            remark: data.remark,
            logTime: data.logTime,
        });
    }

    async findAllByTaskId(taskId: string): Promise<IMethodLog[]> {
        const logs = await MethodLog.findAll({
            where: {
                taskId,
            },
        });
        return logs.map((el) =>
            EntityMethodLog.create({
                id: el.id,
                taskId: el.taskId,
                reportBy: el.reportBy,
                remark: el.remark,
                logTime: el.logTime,
            })
        );
    }
}
