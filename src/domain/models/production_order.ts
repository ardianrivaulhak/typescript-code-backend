import { Entity } from "./entity";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { ITask } from "./task";
import { ISchedule } from "./schedule";
import { IPart } from "./part";
import { ILine } from "./line";

export interface IProductionOrder {
    id?: string;
    taskId: string;
    scheduleId?: string | null;
    partId?: string;
    actualLineId: string;
    qty: number;
    purpose: string;
    startTime?: Date | undefined | null;
    finishTime?: Date| undefined | null;
    status: "pending" | "running" | "complete";
    actualOutput: number;
    ngCount: number;
    cycleTime: number;
    task?: ITask;
    schedule?: ISchedule;
    part?: IPart;
    actualLine?: ILine;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class ProductionOrder extends Entity<IProductionOrder> {
    private constructor(props: IProductionOrder) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IProductionOrder): ProductionOrder {
        const instance = new ProductionOrder(props);
        return instance;
    }

    public unmarshal(): IProductionOrder {
        return {
            id: this._id,
            taskId: this.taskId,
            scheduleId: this.scheduleId,
            partId: this.partId,
            actualLineId: this.actualLineId,
            qty: this.qty,
            purpose: this.purpose,
            startTime: this.startTime,
            finishTime: this.finishTime,
            status: this.status,
            actualOutput: this.actualOutput,
            ngCount: this.ngCount,
            cycleTime: this.cycleTime,
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
    get scheduleId(): string | undefined | null {
        return this.props.scheduleId;
    }
    get partId(): string | undefined {
        return this.props.partId;
    }
    get actualLineId(): string {
        return this.props.actualLineId;
    }
    get qty(): number {
        return this.props.qty;
    }
    get purpose(): string {
        return this.props.purpose;
    }
    get startTime(): Date | undefined | null{
        return this.props.startTime;
    }
    get finishTime(): Date | undefined | null{
        return this.props.finishTime;
    }
    get status(): "pending" | "running" | "complete" {
        return this.props.status;
    }
    get actualOutput(): number {
        return this.props.actualOutput;
    }
    get ngCount(): number {
        return this.props.ngCount;
    }
    get cycleTime(): number {
        return this.props.cycleTime;
    }
    get task(): undefined | ITask {
        return this.props.task;
    }
    get schedule(): undefined | ISchedule {
        return this.props.schedule;
    }
    get part(): undefined | IPart {
        return this.props.part;
    }
    get actualLine(): undefined | ILine {
        return this.props.actualLine;
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
