import { AuthHmiRequest } from "@/presentation/utils/types/jwt-request";
import { MenuControlService } from "@/services/andon/menu-control-service";
import { TYPES } from "@/types";
import { Request, Response } from "express";
import { injectable, inject } from "inversify";

@injectable()
export default class MenuController {
    constructor(@inject(TYPES.MenuControlService) private _menuService: MenuControlService) {}

    public async getGeneral(req: AuthHmiRequest, res: Response): Promise<Response> {
        const machineId = req.authHmi.machine.id || "";
        const shiftId = req.authHmi.shift.id || "";
        const data = await this._menuService.getGeneral(shiftId, machineId);
        return res.json({
            message: "success",
            data,
        });
    }

    public async getProductionPlan(req: AuthHmiRequest, res: Response): Promise<Response> {
        const machineId = req.authHmi.machine.id || "";
        const shiftId = req.authHmi.shift.id || "";
        const data = await this._menuService.getProductionPlan(shiftId, machineId);
        return res.json({
            message: "success",
            data,
        });
    }

    public async getMachineList(req: Request, res: Response): Promise<Response> {
        const machines = await this._menuService.getMachines();
        return res.json({
            message: "success",
            data: machines,
        });
    }

    public async getShiftList(req: Request, res: Response): Promise<Response> {
        const shifts = await this._menuService.getShifts();
        return res.json({
            message: "success",
            data: shifts,
        });
    }
}
