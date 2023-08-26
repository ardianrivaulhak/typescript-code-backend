import { IAccessPermission } from "./access_permission";
import { Entity } from "./entity";

export enum PermissionList {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  EXPORT = "export",
  IMPORT = "import",
}
export interface IPermission {
  id?: string;
  name: string;
  accessPermissions?: IAccessPermission[];
  permissionHasAccess?: IAccessPermission;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Permission extends Entity<IPermission> {
  private constructor(props: IPermission) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IPermission): Permission {
    const instance = new Permission(props);
    return instance;
  }

  public unmarshal(): IPermission {
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
  get accessPermissions(): undefined | IAccessPermission[] {
    return this.props.accessPermissions;
  }
  get permissionHasAccess(): undefined | IAccessPermission {
    return this.props.permissionHasAccess;
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
