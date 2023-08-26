import { ISessionLogin, SessionLogin } from "../models/session_login";
import { TableData } from "../models/table-data";
import { TDataTableSession } from "./types";
export interface SessionLoginRepository {
  findAll(): Promise<SessionLogin[]>;
  findSessionData(param: TDataTableSession): Promise<SessionLogin | undefined>;
  findSession(param: TDataTableSession): Promise<boolean>;
  store(session_login: SessionLogin): Promise<SessionLogin>;
  updateSessionLogout(userId: string, logoutTime: Date): Promise<void>;
}
