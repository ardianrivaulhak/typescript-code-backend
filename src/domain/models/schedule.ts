import { Entity } from "./entity";
import { ILine } from "./line";
import { IPart } from "./part";

export interface ISchedule {
  id?: string;
  partId: string;
  lineId: string;
  poNumber: string;
  startDate: Date;
  endDate: Date;
  qty: number;
  balance: number;
  status: "open" | "closed";
  part?: IPart | undefined;
  line?: ILine | undefined;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Schedule extends Entity<ISchedule> {
    private constructor(props: ISchedule) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: ISchedule): Schedule {
        const instance = new Schedule(props);
        return instance;
    }

    public unmarshal(): ISchedule {
        return {
            id: this._id,
            partId: this.partId,
            lineId: this.lineId,
            poNumber: this.poNumber,
            startDate: this.startDate,
            endDate: this.endDate,
            qty: this.qty,
            balance:this.balance,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }

    get id(): string {
        return this._id;
    }
    get partId(): string {
        return this.props.partId;
    }
    get lineId(): string {
        return this.props.lineId;
    }
    get poNumber(): string {
        return this.props.poNumber;
    }
    get startDate(): Date {
        return this.props.startDate;
    }
    get endDate(): Date {
        return this.props.endDate;
    }
    get qty(): number {
        return this.props.qty;
    }
    get balance(): number {
        return this.props.balance;
    }
    get status(): "open" | "closed" {
        return this.props.status;
    }
    get part(): undefined | IPart {
        return this.props.part;
    }
    get line(): undefined | ILine {
        return this.props.line;
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
