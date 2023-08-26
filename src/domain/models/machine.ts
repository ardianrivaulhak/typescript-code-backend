import { Entity } from "./entity";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { IMulterFile } from "@/presentation/validation/types";
import { ILine } from "./line";

export interface IMachine {
  id?: string;
  no_machine: number;
  name: string;
  line_id: string;
  line?: ILine | undefined;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Machine extends Entity<IMachine> {
  private constructor(props: IMachine) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IMachine): Machine {
    const instance = new Machine(props);

    return instance;
  }

  public unmarshal(): IMachine {
    return {
      id: this.id,
      no_machine: this.no_machine,
      name: this.name,
      line_id: this.line_id,
      line: this.line,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get no_machine(): number {
    return this.props.no_machine;
  }

  get name(): string {
    return this.props.name;
  }

  get line_id(): string {
    return this.props.line_id;
  }

  get line(): ILine | undefined {
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
