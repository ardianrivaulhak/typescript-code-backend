import { Entity } from "./entity";
import { ITask } from "./task";

export interface IPreparationTimeLog {
    id?: string;
    taskId: string;
    startTime: Date;
    finishTime?: Date | null;
    task?: ITask;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class PreparationTimeLog extends Entity<IPreparationTimeLog> {
    private constructor(props: IPreparationTimeLog) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IPreparationTimeLog): PreparationTimeLog {
        const instance = new PreparationTimeLog(props);
        return instance;
    }

    public unmarshal(): IPreparationTimeLog {
        return {
            id: this._id,
            taskId: this.taskId,
            startTime: this.startTime,
            finishTime: this.finishTime,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }

    get id(): string {
        return this._id;
    }
    get taskId(): string {
        return this.props.taskId;
    }
    get startTime(): Date {
        return this.props.startTime;
    }
    get finishTime(): Date | undefined | null{
        return this.props.finishTime;
    }
    get task(): undefined | ITask {
        return this.props.task;
    }
    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }
    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }
    get deletedAt(): Date | undefined {
        return this.props.deletedAt;
    }
}
