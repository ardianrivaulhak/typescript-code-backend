import { Entity } from "./entity";
import { IProductionOrder } from "./production_order";
import { IDefects } from "./defects";

export interface IProductionDefect {
    id?: string;
    productionOrderId: string;
    defectId: string;
    date: Date;
    qty: number;
    remark: string;
    productionOrder?: IProductionOrder;
    defect?: IDefects;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class ProductionDefect extends Entity<IProductionDefect> {
    private constructor(props: IProductionDefect) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IProductionDefect): ProductionDefect {
        const instance = new ProductionDefect(props);
        return instance;
    }

    public unmarshal(): IProductionDefect {
        return {
            id: this._id,
            productionOrderId: this.productionOrderId,
            defectId: this.defectId,
            date: this.date,
            qty: this.qty,
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
    get defectId(): string {
        return this.props.defectId;
    }
    get date(): Date {
        return this.props.date;
    }
    get qty(): number {
        return this.props.qty;
    }
    get remark(): string {
        return this.props.remark;
    }

    get productionOrder(): undefined | IProductionOrder {
        return this.props.productionOrder;
    }
    get defect(): undefined | IDefects {
        return this.props.defect;
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
