import { Auth, IAuth } from "@/domain/models/auth";
import { UserRepository } from "@/domain/service/user-repository";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { webadminLoginScheme } from "@/presentation/validation/web-admin/user-validation";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";

@injectable()
export class WebadminAuthService {
  constructor(@inject(TYPES.UserRepository) private _userRepo: UserRepository) {}
  public async login(param: typeof webadminLoginScheme._output): Promise<IAuth> {
    const user = await this._userRepo.findByEmail(param.email);
    if (!user.verifyPassword(param.password)) {
      throw new AppError({
        statusCode: HttpCode.UNAUTHORIZED,
        description: "Wrong Password",
      });
    }
    const auth = Auth.create({ user: { ...user.unmarshal(), password: undefined } });
    return auth.unmarshal();
  }
  public async me(token: string): Promise<IAuth> {
    const auth = Auth.createFromToken(token);
    const user = await this._userRepo.findByIdWithRoleAccess(auth.user.id);
    auth.user = {
      ...user.unmarshal(),
      password: undefined,
    };
    return auth.unmarshal();
  }
}
