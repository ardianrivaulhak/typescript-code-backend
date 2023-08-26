import { Router } from "express";
import { injectable } from "inversify";
import { WebAdminRoutes } from "./web-admin";
import { hmiRoutes } from "./andon";

@injectable()
export class Routes {
  constructor(private webAdminRoutes: WebAdminRoutes, private hmiRoutes: hmiRoutes) {}

  public setRoutes(router: Router) {
    router.use("/web-admin", this.webAdminRoutes.router);
    router.use("/andon", this.hmiRoutes.router);
  }
}
