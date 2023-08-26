import { Entity } from "./entity";
import { ITask } from "./task";
import { IPart } from "./part";
import { IEquipment } from "./equipment";

export interface IProductionEquipment {
    id?: string;
    taskId: string;
    equipmentId: string;
    partId: string;
    note: string;
    isChanged: boolean;
    isActive: boolean;
    task?: ITask;
    equipment?: IEquipment;
    part?: IPart;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class ProductionEquipment extends Entity<IProductionEquipment> {
    private constructor(props: IProductionEquipment) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IProductionEquipment): ProductionEquipment {
        const instance = new ProductionEquipment(props);
        return instance;
    }

    public unmarshal(): IProductionEquipment {
        return {
            id: this._id,
            taskId: this.taskId,
            equipmentId: this.equipmentId,
            partId: this.partId,
            note: this.note,
            isChanged: this.isChanged,
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
    get equipmentId(): string {
        return this.props.equipmentId;
    }
    get partId(): string {
        return this.props.partId;
    }
    get note(): string {
        return this.props.note;
    }
    get isChanged(): boolean {
        return this.props.isChanged;
    }
    get isActive(): boolean {
        return this.props.isActive;
    }
    
    get task(): undefined | ITask {
        return this.props.task;
    }
    get equipment(): undefined | IEquipment {
        return this.props.equipment;
    }
    get part(): undefined | IPart {
        return this.props.part;
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
