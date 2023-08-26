import { Entity } from "./entity";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { IMulterFile } from "@/presentation/validation/types";

export interface ILine {
  id?: string;
  no_line: number;
  name: string;
  layout_url?: string | IMulterFile | undefined;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Line extends Entity<ILine> {
  private constructor(props: ILine) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: ILine): Line {
    const instance = new Line(props);
    return instance;
  }

  public unmarshal(): ILine {
    return {
      id: this.id,
      no_line: this.no_line,
      name: this.name,
      layout_url: this.layout_url,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get no_line(): number {
    return this.props.no_line;
  }

  get name(): string {
    return this.props.name;
  }

  get layout_url(): undefined | string | IMulterFile {
    return this.props.layout_url;
  }

  set layout_url(val: undefined | string | IMulterFile) {
    this.props.layout_url = val;
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
