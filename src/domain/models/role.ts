import { Access, IAccess } from "./access";
import { IAccessPermission } from "./access_permission";
import { Entity } from "./entity";

export interface IRole {
  id?: string;
  name: string;
  accesses?: IAccess[];
  accessPermissions?: IAccessPermission[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Role extends Entity<IRole> {
  private constructor(props: IRole) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IRole): Role {
    const instance = new Role(props);
    return instance;
  }

  public unmarshal(): IRole {
    return {
      id: this._id,
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
  get accesses(): undefined | IAccess[] {
    return this.props.accesses;
  }
  get accessPermissions(): undefined | IAccessPermission[] {
    return this.props.accessPermissions;
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
