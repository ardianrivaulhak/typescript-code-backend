import { SessionLoginRepository } from "@/domain/service/session-login-repository";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { SessionLogin, User, Machine, Shifts } from "@/infrastructure/database/models";
import { SessionLogin as EntitySessionLogin, ISessionLogin } from "@/domain/models/session_login";
import { Op } from "sequelize";
import { TDataTableSession } from "@/domain/service/types";

@injectable()
export class SessionLoginSequelizeRepository implements SessionLoginRepository {
  async findAll(): Promise<EntitySessionLogin[]> {
    const session = await SessionLogin.findAll();

    return session.map((el) =>
      EntitySessionLogin.create({
        id: el.id,
        userId: el.userId,
        machineId: el.machineId,
        shiftId: el.shiftId,
        loginTime: el.loginTime,
        logoutTime: el.logoutTime,
      })
    );
  }
  async findSessionData(param: TDataTableSession): Promise<EntitySessionLogin | undefined> {
    const data = await SessionLogin.findOne({
      where: {
        userId: param.userId,
        machineId: param.machineId,
        shiftId: param.shiftId,
        logoutTime: { [Op.is]: null },
      },
      include: [
        {
          model: User,
        },
        {
          model: Machine,
        },
        {
          model: Shifts,
        },
      ],
    });

    if (!data) {
      return undefined;
    }

    return EntitySessionLogin.create({
      id: data.id,
      userId: data.userId,
      machineId: data.machineId,
      machine: data.machine,
      shiftId: data.shiftId,
      shift: data.shift,
      loginTime: data.loginTime,
      logoutTime: data.logoutTime,
    });
  }

  async findSession(param: TDataTableSession): Promise<boolean> {
    const session = await SessionLogin.findOne({
      where: {
        userId: param.userId,
        machineId: param.machineId,
        shiftId: param.shiftId,
        logoutTime: { [Op.is]: null },
      },
      include: [
        {
          model: User,
        },
        {
          model: Machine,
        },
        {
          model: Shifts,
        },
      ],
    });

    const cek = session?.logoutTime == null;
    return cek;
  }

  async store(_sessionLogin: EntitySessionLogin): Promise<EntitySessionLogin> {
    const t = await sequelize.transaction();

    try {
      const sessionLogin = await SessionLogin.create(
        {
          id: _sessionLogin.id,
          userId: _sessionLogin.userId,
          machineId: _sessionLogin.machineId,
          shiftId: _sessionLogin.shiftId,
          loginTime: _sessionLogin.loginTime,
          logoutTime: _sessionLogin.logoutTime,
        },
        { transaction: t }
      );

      await t.commit();

      const entity = await EntitySessionLogin.create({
        id: sessionLogin.id,
        userId: sessionLogin.userId,
        machineId: sessionLogin.machineId,
        machine: sessionLogin.machine,
        shiftId: sessionLogin.shiftId,
        shift: sessionLogin.shift,
        loginTime: sessionLogin.loginTime,
        logoutTime: sessionLogin.logoutTime,
        createdAt: sessionLogin.created_at,
        updatedAt: sessionLogin.updated_at,
        deletedAt: sessionLogin.deleted_at,
      });

      return entity;
    } catch (e) {
      console.log(e);
      await t.rollback();
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Failed to create problem",
        error: e,
      });
    }
  }
  async updateSessionLogout(userId: string, logoutTime: Date): Promise<void> {
    const session = await SessionLogin.findOne({
      where: {
        userId: userId,
        logoutTime: { [Op.is]: null },
      },
    });

    if (!session) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Session not found",
      });
    }

    await session.update({
      logoutTime: logoutTime,
    });

    await session.reload();
  }
}
