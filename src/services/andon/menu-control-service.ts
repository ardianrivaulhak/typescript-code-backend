import { MachineRepository } from "@/domain/service/machine-repository";
import { ProductionOrderRepository } from "@/domain/service/production-order-repository";
import { ShiftsRepository } from "@/domain/service/shifts-repository";
import { TaskRepository } from "@/domain/service/task-repository";
import { IGeneralControlMenu, IProductionPlanMenu } from "@/dto/control-menu-dto";
import { IListMachineAuthHmi } from "@/dto/machine-dto";
import { IListShiftAuthHmi } from "@/dto/shift-dto";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";

@injectable()
export class MenuControlService {
    constructor(
        @inject(TYPES.TaskRepository) private _taskRepository: TaskRepository,
        @inject(TYPES.ProductionOrderRepository) private _poRepository: ProductionOrderRepository,
        @inject(TYPES.MachineRepository) private _machineRepository: MachineRepository,
        @inject(TYPES.ShiftsRepository) private _shiftRepository: ShiftsRepository


    ) {}

    public async getGeneral(shiftId: string, machineId: string): Promise<IGeneralControlMenu> {
        const status: IGeneralControlMenu = {
            productionPlan: true,
            preparation: false,
            productionProblem: false,
            dataDefect: false,
            method: false,
            material: false,
            equipment: false,
            manpower: false,
            layout: true,
        };
        const task = await this._taskRepository.findRunningComplete(shiftId, machineId);
        if (!task) return status;
        if (task.productionOrders && task.productionEquipments && task.productionManpowers) {
            if (task.productionOrders.length > 0 && task.productionEquipments.length > 0 && task.productionManpowers.length > 0) {
                status.productionPlan = false;
                status.preparation = true;
            }
        }
        const runningPO = await this._poRepository.findRunning(task.id);
        if (runningPO) {
            status.productionPlan = false;
            status.preparation = false;
            status.productionProblem = true;
            status.dataDefect = true;
            status.method = true;
            status.material = true;
            status.equipment = true;
            status.manpower = true;
        }
        return status;
    }

    public async getProductionPlan(shiftId: string, machineId: string): Promise<IProductionPlanMenu> {
        const status: IProductionPlanMenu = {
            schedule: true,
            equipment: false,
            manpower: false,
            finish: false,
        };
        const task = await this._taskRepository.findRunningComplete(shiftId, machineId);
        if (!task) return status;
        if (task.productionOrders && task.productionEquipments && task.productionManpowers) {
            if (task.productionOrders.length > 0 && task.productionEquipments.length > 0 && task.productionManpowers.length > 0) {
                status.schedule = false;
                status.equipment = false;
                status.manpower = false;
                status.finish = true;
                return status;
            }
            if (task.productionOrders.length > 0 && task.productionEquipments.length === 0) {
                status.schedule = false;
                status.equipment = true;
                return status;
            }
            if (task.productionOrders.length > 0 && task.productionEquipments.length > 0) {
                status.schedule = false;
                status.manpower = true;
                return status;
            }
        }
        return status;
    }

    public async getMachines(): Promise<IListMachineAuthHmi[]> {
        const machines = await this._machineRepository.findAll();
        return machines.map((el)=> ({
            id: el.id,
            name: el.name
        }));
    }

    public async getShifts(): Promise<IListShiftAuthHmi[]> {
        const machines = await this._shiftRepository.findAll();
        return machines.map((el)=> ({
            id: el.id,
            name: el.name
        }));
    }
}
