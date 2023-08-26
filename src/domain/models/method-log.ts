import { Entity } from "./entity";
import { ITask } from "./task";

export interface IMethodLog {
    id?: string;
    taskId: string;
    remark: string;
    reportBy: string;
    logTime: Date;
    task?: ITask;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class MethodLog extends Entity<IMethodLog> {
    private constructor(props: IMethodLog) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IMethodLog): MethodLog {
        const instance = new MethodLog(props);
        return instance;
    }

    public unmarshal(): IMethodLog {
        return {
            id: this._id,
            taskId: this.taskId,
            remark: this.remark,
            reportBy: this.reportBy,
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
    get remark(): string {
        return this.props.remark;
    }
    get reportBy(): string {
        return this.props.reportBy;
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
