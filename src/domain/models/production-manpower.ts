import { Entity } from "./entity";
import { ITask } from "./task";
import { IManpower } from "./manpower";

export interface IProductionManpower {
    id?: string;
    taskId: string;
    manpowerId: string;
    indicator: "existing" | "subtitution" | "absent";
    isActive: boolean;
    task?: ITask;
    manpower?: IManpower;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class ProductionManpower extends Entity<IProductionManpower> {
    private constructor(props: IProductionManpower) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IProductionManpower): ProductionManpower {
        const instance = new ProductionManpower(props);
        return instance;
    }

    public unmarshal(): IProductionManpower {
        return {
            id: this._id,
            taskId: this.taskId,
            manpowerId: this.manpowerId,
            indicator: this.indicator,
            isActive: this.isActive,
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
    get manpowerId(): string {
        return this.props.manpowerId;
    }
    get indicator(): "existing" | "subtitution" | "absent" {
        return this.props.indicator;
    }
    get isActive(): boolean {
        return this.props.isActive;
    }

    get task(): undefined | ITask {
        return this.props.task;
    }
    get manpower(): undefined | IManpower {
        return this.props.manpower;
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
