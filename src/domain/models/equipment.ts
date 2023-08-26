import { Entity } from "./entity";
import { IPart } from "./part";

export interface IEquipment {
  id?: string;
  part_id: string;
  no_equipment: string;
  name: string;
  part?: IPart | undefined;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Equipment extends Entity<IEquipment> {
  private constructor(props: IEquipment) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IEquipment): Equipment {
    const instance = new Equipment(props);

    return instance;
  }

  public unmarshal(): IEquipment {
    return {
      id: this.id,
      part_id: this.part_id,
      part: this.part,
      no_equipment: this.no_equipment,
      name: this.name,
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

  get no_equipment(): string {
    return this.props.no_equipment;
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
