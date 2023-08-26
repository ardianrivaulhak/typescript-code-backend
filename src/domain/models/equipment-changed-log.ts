import { Entity } from "./entity";
import { ITask } from "./task";

export interface IEquipmentChangedLog {
    id?: string;
    taskId: string;
    from: string;
    to: string;
    changedBy: string;
    logTime: Date;
    task?: ITask;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class EquipmentChangedLog extends Entity<IEquipmentChangedLog> {
    private constructor(props: IEquipmentChangedLog) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IEquipmentChangedLog): EquipmentChangedLog {
        const instance = new EquipmentChangedLog(props);
        return instance;
    }

    public unmarshal(): IEquipmentChangedLog {
        return {
            id: this._id,
            taskId: this.taskId,
            from: this.from,
            to: this.to,
            changedBy: this.changedBy,
            logTime: this.logTime,
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
    get from(): string {
        return this.props.from;
    }
    get to(): string {
        return this.props.to;
    }
    get changedBy(): string {
        return this.props.changedBy;
    }
    get logTime(): Date {
        return this.props.logTime;
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
