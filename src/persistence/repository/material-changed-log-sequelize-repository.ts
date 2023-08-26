import { MaterialChangedLog } from "@/infrastructure/database/models";
import { MaterialChangedLog as EntityMaterialChangeLog, IMaterialChangedLog } from "@/domain/models/material-changed-log";
import { injectable } from "inversify";
import { MaterialChangedLogRepository } from "@/domain/service/material-changed-log-repository";

@injectable()
export class MaterialChangedLogSequelizeRepository implements MaterialChangedLogRepository {
    async store(domain: EntityMaterialChangeLog): Promise<IMaterialChangedLog> {
        await MaterialChangedLog.create({
            id: domain.id,
            taskId: domain.taskId,
            name: domain.name,
            from: domain.from,
            to: domain.to,
            changedBy: domain.changedBy,
            logTime: domain.logTime,
        });
        return EntityMaterialChangeLog.create({
            id: domain.id,
            taskId: domain.taskId,
            name: domain.name,
            from: domain.from,
            to: domain.to,
            changedBy: domain.changedBy,
            logTime: domain.logTime,
        });
    }
}
