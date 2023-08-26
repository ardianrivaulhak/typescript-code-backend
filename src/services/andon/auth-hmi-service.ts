import { AuthHmi, IAuthHmi } from "@/domain/models/auth-hmi";
import { UserRepository } from "@/domain/service/user-repository";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { hmiLoginScheme } from "@/presentation/validation/web-admin/user-validation";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import {} from "@/infrastructure/database/models/session-login-sequelize";
import { SessionLoginRepository } from "@/domain/service/session-login-repository";
import { ISessionLogin, SessionLogin } from "@/domain/models/session_login";
import { MachineRepository } from "@/domain/service/machine-repository";
import { ShiftsRepository } from "@/domain/service/shifts-repository";
import { TDataTableSession } from "@/domain/service/types";

@injectable()
export class hmiAuthService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: UserRepository,
    @inject(TYPES.SessionLoginRepository) private _sessionRepo: SessionLoginRepository,
    @inject(TYPES.MachineRepository) private _machineRepo: MachineRepository,
    @inject(TYPES.ShiftsRepository) private _shiftRepo: ShiftsRepository
  ) {}
  public async login(param: typeof hmiLoginScheme._output): Promise<IAuthHmi> {
    const user = await this._userRepo.findByEmail(param.email);

    if (!user.verifyPassword(param.password)) {
      throw new AppError({
        statusCode: HttpCode.UNAUTHORIZED,
        description: "Wrong Password",
      });
    }

    const dataTableSession: TDataTableSession = {
      userId: user.id,
      machineId: param.machineId,
      shiftId: param.shiftId,
    };

    const session = await this._sessionRepo.findSessionData(dataTableSession);

    const machine = await this._machineRepo.findById(param.machineId);
    const sfift = await this._shiftRepo.findById(param.shiftId);
    if (session?.logoutTime === null) {
      throw new AppError({
        statusCode: HttpCode.UNAUTHORIZED,
        description: "User is already logged in",
      });
    }

    await this._sessionRepo.store(
      SessionLogin.create({
        userId: user.id,
        machineId: param.machineId,
        shiftId: param.shiftId,
        loginTime: new Date(),
        logoutTime: null,
      })
    );
    const auth = AuthHmi.create({
      user: { ...user.unmarshal(), password: undefined },
      machine: machine.unmarshal(),
      shift: sfift.unmarshal(),
    });
    return auth.unmarshal();
  }

  public async me(token: string): Promise<IAuthHmi> {
    try {
      const auth = AuthHmi.createFromTokenHmi(token);

      return auth.unmarshal();
    } catch (error) {
      console.log(error);

      throw new AppError({
        statusCode: HttpCode.UNAUTHORIZED,
        description: "Unauthorized",
      });
    }
  }

  public async logout(userId: string): Promise<void> {
    const session = new Date();

    await this._sessionRepo.updateSessionLogout(userId, session);
  }
}
