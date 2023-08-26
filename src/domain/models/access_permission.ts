import { IAccess } from "./access";
import { Entity } from "./entity";
import { IPermission } from "./permission";
import { IRole } from "./role";

export interface IAccessPermission {
  id?: string;
  status: boolean;
  isDisabled: boolean;
  roleId: string;
  permissionId: string;
  accessId: string;
  roles?: IRole[];
  permissions?: IPermission[];
  accesses?: IAccess[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class AccessPermission extends Entity<IAccessPermission> {
  private constructor(props: IAccessPermission) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IAccessPermission): AccessPermission {
    const instance = new AccessPermission(props);
    return instance;
  }

  public unmarshal(): IAccessPermission {
    return {
      id: this._id,
      status: this.status,
      isDisabled: this.isDisabled,
      roleId: this.roleId,
      permissionId: this.permissionId,
      accessId: this.accessId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  get id(): string {
    return this._id;
  }
  get status(): boolean {
    return this.props.status;
  }
  get isDisabled(): boolean {
    return this.props.isDisabled;
  }
  get roleId(): string {
    return this.props.roleId;
  }
  get permissionId(): string {
    return this.props.permissionId;
  }
  get accessId(): string {
    return this.props.accessId;
  }
  get roles(): undefined | IRole[] {
    return this.props.roles;
  }
  get permissions(): undefined | IPermission[] {
    return this.props.permissions;
  }
  get accesses(): undefined | IAccess[] {
    return this.props.accesses;
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
