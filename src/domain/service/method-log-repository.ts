import { IListMethodLogHMI } from "@/dto/method-dto";
import { IMethodLog, MethodLog } from "../models/method-log";

export interface MethodLogRepository {
    findAllByTaskId(taskId: string): Promise<IMethodLog[]>;
    store(domain: IMethodLog): Promise<IMethodLog>;
}
