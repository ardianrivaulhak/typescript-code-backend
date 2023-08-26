import { Entity } from "./entity";
import { IProductionOrder } from "./production_order";
import { IProblem } from "./problem";

export interface IProductionProblem {
    id?: string;
    productionOrderId: string;
    problemId: string;
    startTime: Date;
    finishTime: Date;
    remark: string;
    productionOrder?: IProductionOrder;
    problem?: IProblem;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class ProductionProblem extends Entity<IProductionProblem> {
    private constructor(props: IProductionProblem) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IProductionProblem): ProductionProblem {
        const instance = new ProductionProblem(props);
        return instance;
    }

    public unmarshal(): IProductionProblem {
        return {
            id: this._id,
            productionOrderId: this.productionOrderId,
            problemId: this.problemId,
            startTime: this.startTime,
            finishTime: this.finishTime,
            remark: this.remark,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }

    get id(): string {
        return this._id;
    }
    get productionOrderId(): string {
        return this.props.productionOrderId;
    }
    get problemId(): string {
        return this.props.problemId;
    }
    get startTime(): Date {
        return this.props.startTime;
    }
    get finishTime(): Date {
        return this.props.finishTime;
    }
    get remark(): string {
        return this.props.remark;
    }

    get productionOrder(): undefined | IProductionOrder {
        return this.props.productionOrder;
    }
    get problem(): undefined | IProblem {
        return this.props.problem;
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
