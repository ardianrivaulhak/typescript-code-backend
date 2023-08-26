import { Entity } from "./entity";
import { IMachine } from "./machine";
import { IPreparationTimeLog } from "./preparation-time-log";
import { IProductionEquipment } from "./production-equipment";
import { IProductionManpower } from "./production-manpower";
import { IProductionOrder } from "./production_order";
import { IShifts } from "./shifts";

export interface ITask {
    id?: string;
    shiftId: string;
    machineId: string;
    date: Date;
    status: "running" | "finished";
    machine?: IMachine;
    shift?: IShifts;
    productionOrders?: IProductionOrder[];
    productionEquipments?: IProductionEquipment[];
    productionManpowers?: IProductionManpower[];
    preparationTimeLog?: IPreparationTimeLog;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class Task extends Entity<ITask> {
    private constructor(props: ITask) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: ITask): Task {
        const instance = new Task(props);
        return instance;
    }

    public unmarshal(): ITask {
        return {
            id: this.id,
            machineId: this.machineId,
            shiftId: this.shiftId,
            status: this.status,
            date: this.date,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }

    get id(): string {
        return this._id;
    }
    get shiftId(): string {
        return this.props.shiftId;
    }
    get machineId(): string {
        return this.props.machineId;
    }
    get status(): "running" | "finished" {
        return this.props.status;
    }
    get date(): Date {
        return this.props.date;
    }
    get machine(): IMachine | undefined {
        return this.props.machine;
    }
    get shift(): IShifts | undefined {
        return this.props.shift;
    }
    get productionOrders(): IProductionOrder[] | undefined {
        return this.props.productionOrders;
    }
    get productionEquipments(): IProductionEquipment[] | undefined {
        return this.props.productionEquipments;
    }
    get productionManpowers(): IProductionManpower[] | undefined {
        return this.props.productionManpowers;
    }
    get preparationTimeLog(): IPreparationTimeLog | undefined {
        return this.props.preparationTimeLog;
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
