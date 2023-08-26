import { Auth } from "@/domain/models/auth";
import { AuthHmi } from "@/domain/models/auth-hmi";
import { Request } from "express";

export interface AuthRequest extends Request {
  auth: Auth;
}

export interface AuthHmiRequest extends Request {
  authHmi: AuthHmi;
}
