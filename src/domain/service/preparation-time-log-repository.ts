import { Transaction } from "sequelize";
import { IPreparationTimeLog, PreparationTimeLog } from "../models/preparation-time-log";

export interface PreparationTimeLogRepository {
    store(domain: PreparationTimeLog): Promise<IPreparationTimeLog>;
    update(preparationTimeLogId: string, domain: PreparationTimeLog): Promise<IPreparationTimeLog>;
    updateFinish(taskId: string, transaction: Transaction): Promise<IPreparationTimeLog>;
}
