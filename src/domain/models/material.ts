import { Entity } from "./entity";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { IMulterFile } from "@/presentation/validation/types";
import { IPart } from "./part";

export interface IMaterial {
  id?: string;
  part_id: string;
  part?: IPart | undefined;
  no_material: string;
  name: string;
  qty: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Material extends Entity<IMaterial> {
  private constructor(props: IMaterial) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IMaterial): Material {
    const instance = new Material(props);

    return instance;
  }

  public unmarshal(): IMaterial {
    return {
      id: this.id,
      part_id: this.part_id,
      part: this.part,
      no_material: this.no_material,
      name: this.name,
      qty: this.qty,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get part_id(): string {
    return this.props.part_id;
  }

  get part(): IPart | undefined {
    return this.props.part;
  }

  get no_material(): string {
    return this.props.no_material;
  }
  get qty(): number {
    return this.props.qty;
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
