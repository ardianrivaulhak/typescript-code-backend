import { Transaction } from "sequelize";
import { IMaterialChangedLog, MaterialChangedLog } from "../models/material-changed-log";

export interface MaterialChangedLogRepository {
    store(domain: MaterialChangedLog, transaction?: Transaction): Promise<IMaterialChangedLog>;
}
