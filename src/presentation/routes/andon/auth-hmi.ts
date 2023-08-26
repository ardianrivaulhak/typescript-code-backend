import { container } from "@/container";
import asyncWrap from "@/libs/asyncWrapper";
import { HmiAuthController } from "@/presentation/controllers/andon/auth-controller";
import { Router } from "express";
import { injectable } from "inversify";
import { MobileAuthMiddleware } from "@/presentation/middleware/auth-middleware";
@injectable()
export class hmiAuthRoutes {
  public router = Router();
  HmiAuthControllerIncstance = container.get<HmiAuthController>(HmiAuthController);
  HmiAuthMiddleware = container.get<MobileAuthMiddleware>(MobileAuthMiddleware);
  constructor() {
    this.setRoutes();
  }

  public setRoutes() {
    this.router.post("/login", asyncWrap(this.HmiAuthControllerIncstance.loginHmi.bind(this.HmiAuthControllerIncstance)));
    this.router.get(
      "/me",
      this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
      asyncWrap(this.HmiAuthControllerIncstance.meHmi.bind(this.HmiAuthControllerIncstance))
    );
    this.router.put(
      "/logout",
      this.HmiAuthMiddleware.handleHmi.bind(this.HmiAuthMiddleware),
      asyncWrap(this.HmiAuthControllerIncstance.logoutHmi.bind(this.HmiAuthControllerIncstance))
    );
  }
}
