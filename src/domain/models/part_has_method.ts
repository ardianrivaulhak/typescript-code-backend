import { Entity } from "./entity";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { IMulterFile } from "@/presentation/validation/types";
import { IPart } from "./part";
import { IMethod } from "./methods";
export interface IPartHasMethod {
  id?: string;
  part_id: string;
  part?: IPart | undefined;
  method_id: string;
  methods?: IMethod | undefined;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class PartHasMethod extends Entity<IPartHasMethod> {
  private constructor(props: IPartHasMethod) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IPartHasMethod): PartHasMethod {
    const instance = new PartHasMethod(props);

    return instance;
  }

  public unmarshal(): IPartHasMethod {
    return {
      id: this.id,
      part_id: this.part_id,
      part: this.part,
      method_id: this.method_id,
      methods: this.methods,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  get id(): string {
    return this._id;
  }

  get part_id(): string {
    return this.props.part_id;
  }

  get part(): IPart | undefined {
    return this.props.part;
  }

  get method_id(): string {
    return this.props.method_id;
  }

  get methods(): IMethod | undefined {
    return this.props.methods;
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
