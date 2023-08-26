import { ITask, Task } from "../models/task";

export interface TaskRepository {
    findAll(): Promise<Task[]>;
    store(task: ITask): Promise<Task>;
    findRunning(shiftId: string): Promise<Task | undefined>;
    findRunningComplete(shiftId: string, machineId: string): Promise<Task | undefined>;
}
