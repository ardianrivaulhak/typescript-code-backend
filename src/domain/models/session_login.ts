import { IAccessPermission } from "./access_permission";
import { Entity } from "./entity";
import { IMachine } from "./machine";
import { IShifts } from "./shifts";

export interface ISessionLogin {
  id?: string;
  userId: string;
  machineId: string;
  machine?: IMachine | undefined;
  shiftId: string;
  shift?: IShifts | undefined;
  loginTime: Date;
  logoutTime?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class SessionLogin extends Entity<ISessionLogin> {
  private constructor(props: ISessionLogin) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: ISessionLogin): SessionLogin {
    const instance = new SessionLogin(props);
    return instance;
  }

  public unmarshal(): ISessionLogin {
    return {
      id: this._id,
      userId: this.userId,
      machineId: this.machineId,
      shiftId: this.userId,
      loginTime: this.loginTime,
      logoutTime: this.logoutTime,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this.props.userId;
  }

  get machineId(): string {
    return this.props.machineId;
  }

  get machine(): IMachine | undefined {
    return this.props.machine;
  }
  get shiftId(): string {
    return this.props.shiftId;
  }

  get shift(): IShifts | undefined {
    return this.props.shift;
  }

  get loginTime(): Date {
    return this.props.loginTime;
  }

  get logoutTime(): Date | undefined | null {
    return this.props.logoutTime;
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
