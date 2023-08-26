import { SessionLogin, ISessionLogin } from "@/domain/models/session_login";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { hmiLoginScheme } from "@/presentation/validation/web-admin/user-validation";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import {} from "@/infrastructure/database/models/session-login-sequelize";
import { SessionLoginRepository } from "@/domain/service/session-login-repository";
import { TDataTableSession } from "@/domain/service/types";
@injectable()
export class sessionLoginService {
  constructor(@inject(TYPES.SessionLoginRepository) private _sessionRepo: SessionLoginRepository) {}
  public async findAll(): Promise<ISessionLogin[]> {
    const session = await this._sessionRepo.findAll();

    const sessionDto = session.map((prob) => {
      return {
        id: prob.id,
        userId: prob.userId,
        machineId: prob.machineId,
        machine: prob.machine,
        shiftId: prob.shiftId,
        shift: prob.shift,
        loginTime: prob.loginTime,
        logoutTime: prob.logoutTime,
      };
    });

    return sessionDto;
  }

  public async findById(param: TDataTableSession): Promise<ISessionLogin | undefined> {
    const sessionLogin = await this._sessionRepo.findSessionData(param);

    if (!sessionLogin) {
      return undefined;
    }
    return sessionLogin.unmarshal();
  }

  public async store(_sessionLogin: ISessionLogin): Promise<ISessionLogin> {
    const sesEntity = SessionLogin.create(_sessionLogin);
    const session = await this._sessionRepo.store(sesEntity);

    return session.unmarshal();
  }

  //   public async update(_depects: IDefects, depects_id: string): Promise<void> {
  //     const depEntity = Defects.create(_depects);

  //     await this._depectsRepository.update(depects_id, depEntity);
  //   }
}
