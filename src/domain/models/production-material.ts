import { Entity } from "./entity";
import { IMaterial } from "./material";
import { ITask } from "./task";

export interface IProductionMaterial {
    id?: string;
    taskId: string;
    materialId: string;
    lotNo?: string;
    remark?: string;
    task?: ITask;
    material?: IMaterial;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class ProductionMaterial extends Entity<IProductionMaterial> {
    private constructor(props: IProductionMaterial) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IProductionMaterial): ProductionMaterial {
        const instance = new ProductionMaterial(props);
        return instance;
    }

    public unmarshal(): IProductionMaterial {
        return {
            id: this._id,
            taskId: this.taskId,
            materialId: this.materialId,
            lotNo: this.lotNo,
            remark: this.remark,
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
    get materialId(): string {
        return this.props.materialId;
    }
    get lotNo(): string | undefined{
        return this.props.lotNo;
    }
    get remark(): string | undefined{
        return this.props.remark;
    }
    get task(): undefined | ITask {
        return this.props.task;
    }
    get material(): undefined | IMaterial {
        return this.props.material;
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
