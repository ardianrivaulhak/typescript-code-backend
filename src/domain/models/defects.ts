import { Entity } from "./entity";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";

export interface IDefects {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Defects extends Entity<IDefects> {
  private constructor(props: IDefects) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IDefects): Defects {
    const instance = new Defects(props);
    return instance;
  }

  public unmarshal(): IDefects {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
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
