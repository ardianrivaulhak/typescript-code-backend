import { JWT_SECRET } from "@/libs/utils";
import { IUser, User } from "./user";
import jwt from "jsonwebtoken";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { IMachine } from "./machine";
import { IShifts } from "./shifts";
import { IAuth } from "./auth";

export interface IAuthHmi extends IAuth {
  machine: IMachine;
  shift: IShifts;
}

export class AuthHmi {
  private props: IAuthHmi;

  private constructor(props: IAuthHmi) {
    this.props = {
      ...props,
      token: props.token || jwt.sign(props, JWT_SECRET),
    };
  }

  public static create(props: IAuthHmi): AuthHmi {
    const instance = new AuthHmi(props);
    return instance;
  }

  public static createFromTokenHmi(token: string): AuthHmi {
    try {
      const parsedAuth: IAuthHmi = <IAuthHmi>jwt.verify(token, JWT_SECRET);

      return new AuthHmi({
        user: parsedAuth.user,
        machine: parsedAuth.machine,
        shift: parsedAuth.shift,
        token: token,
      });
    } catch (e) {
      throw new AppError({
        statusCode: HttpCode.UNAUTHORIZED,
        description: "Unauthorized",
      });
    }
  }

  public unmarshal(): IAuthHmi {
    return {
      token: this.token,
      user: this.user.unmarshal(),
      machine: this.machine,
      shift: this.shift,
    };
  }

  get token(): string {
    return this.props.token || "";
  }

  get user(): User {
    return User.create(this.props.user);
  }

  get machine(): IMachine {
    return this.props.machine;
  }

  get shift(): IShifts {
    return this.props.shift;
  }

  set user(val: IUser) {
    this.props.user = val;
  }
}
