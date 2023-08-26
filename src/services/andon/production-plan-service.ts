import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import { ITask, Task } from "@/domain/models/task";
import { TaskRepository } from "@/domain/service/task-repository";
import moment from "moment";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { ScheduleRepository } from "@/domain/service/schedule-repository";
import { IHmiSchedule } from "@/dto/schedule-dto";
import { IProductionOrder, ProductionOrder } from "@/domain/models/production_order";
import { ProductionOrderRepository } from "@/domain/service/production-order-repository";
import { IManualProductionOrderPayload, IProductionOrderPayload } from "@/dto/production-order-dto";
import { sequelize } from "@/infrastructure/database/sequelize";
import { IListEquipmentHmi, IPayloadEquipmentHmi } from "@/dto/equipment-dto";
import { EquipmentRepository } from "@/domain/service/equipment-repository";
import { ProductionEquipmentRepository } from "@/domain/service/production-equipment-repository";
import { IProductionEquipment, ProductionEquipment } from "@/domain/models/production-equipment";
import { IListManpower, IListManpowerHmi, IPayloadManpowerHmi } from "@/dto/manpower-dto";
import { ManpowerRepository } from "@/domain/service/manpower-repository";
import { IProductionManpower, ProductionManpower } from "@/domain/models/production-manpower";
import { ProductionManpowerRepository } from "@/domain/service/production-manpower-repository";
import { PreparationTimeLogRepository } from "@/domain/service/preparation-time-log-repository";
import { IPreparationTimeLog, PreparationTimeLog } from "@/domain/models/preparation-time-log";
import { MaterialRepository } from "@/domain/service/material-repository";
import { IListMaterialHMI } from "@/dto/material-dto";
import { ProductionMaterialRepository } from "@/domain/service/production-material-repository";
import { ProductionMaterial } from "@/domain/models/production-material";

@injectable()
export class ProductionPlanService {
    constructor(
        @inject(TYPES.TaskRepository) private _taskRepository: TaskRepository,
        @inject(TYPES.ScheduleRepository) private _scheduleRepository: ScheduleRepository,
        @inject(TYPES.ProductionOrderRepository) private _poRepository: ProductionOrderRepository,
        @inject(TYPES.EquipmentRepository) private _equipmentRepository: EquipmentRepository,
        @inject(TYPES.ProductionEquipmentRepository) private _prodEquipmentRepository: ProductionEquipmentRepository,
        @inject(TYPES.ManpowerRepository) private _manpowerRepository: ManpowerRepository,
        @inject(TYPES.ProductionManpowerRepository) private _prodManpowerRepository: ProductionManpowerRepository,
        @inject(TYPES.PreparationTimeLogRepository) private _prepTimeLogRepository: PreparationTimeLogRepository,
        @inject(TYPES.MaterialRepository) private _materialRepository: MaterialRepository,
        @inject(TYPES.ProductionMaterialRepository) private _prodMaterialRepository: ProductionMaterialRepository
    ) {}

    public async findAll(): Promise<Task[]> {
        const data = await this._taskRepository.findAll();
        return data;
    }

    public async start(machineId: string, shiftId: string): Promise<ITask> {
        const startedTask = await this._taskRepository.findRunning(shiftId);
        if (startedTask) {
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Production plan has already started",
            });
        }
        const task = await this._taskRepository.store(
            Task.create({
                date: moment().toDate(),
                status: "running",
                machineId,
                shiftId,
            })
        );
        await this._prepTimeLogRepository.store(
            PreparationTimeLog.create({
                taskId: task.id,
                startTime: moment().toDate(),
            })
        );
        return task.unmarshal();
    }

    public async finish(taskId: string): Promise<IPreparationTimeLog> {
        const t = await sequelize.transaction();
        const timeLog = await this._prepTimeLogRepository.updateFinish(taskId, t);
        const po = await this._poRepository.findAllWithSchedulePartByTaskId(taskId);
        const partIds = po.map((el) => {
            const partid = el.schedule ? el.schedule.part?.id : el.part?.id;
            if (partid) {
                return partid;
            }
        });
        const material = await this._materialRepository.findAllByPartIdBulk(partIds);
        const materialIds = material.map((el) => el.id);
        if (materialIds.length === 0) {
            await t.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Parts material on selected schedule / part not existed on master data",
            });
        }
        for (let i = 0; i < materialIds.length; i++) {
            const id = materialIds[i];
            if (id)
                await this._prodMaterialRepository.store(
                    ProductionMaterial.create({
                        taskId,
                        materialId: id,
                    }),
                    t
                );
        }
        await t.commit();
        return timeLog;
    }

    public async getTodaySchedule(taskId: string): Promise<IHmiSchedule[]> {
        const schedules = await this._scheduleRepository.findToday();
        const production_orders = await this._poRepository.findCurrentManualPending(taskId);
        const dataSchedules = schedules.map((el) => ({
            id: el.id,
            poNumber: el.poNumber,
            partNumber: el.part?.no_part,
            partName: el.part?.name,
            qty: el.qty,
            balance: el.balance,
            date: moment(el.startDate).format("DD/MM/YY")

        }));
        const dataProduction_orders = production_orders.map((el) => ({
            id: el.id,
            poNumber: "",
            partNumber: el.part?.no_part,
            partName: el.part?.name,
            qty: el.qty,
            balance: el.qty,
            date: moment(el.startTime).format("DD/MM/YYYY")
        }));
        return [...dataSchedules, ...dataProduction_orders];
    }

    public async createManualPO(poDomain: IManualProductionOrderPayload): Promise<IProductionOrder> {
        const data = await this._poRepository.store(
            ProductionOrder.create({
                taskId: poDomain.taskId,
                partId: poDomain.partId,
                actualLineId: poDomain.actualLineId,
                qty: poDomain.qty,
                purpose: poDomain.purpose,
                startTime: poDomain.startTime,
                finishTime: poDomain.finishTime,
                status: "pending",
                actualOutput: 0,
                ngCount: 0,
                cycleTime: 0,
            })
        );

        return data.unmarshal();
    }

    public async createPO(poPayload: IProductionOrderPayload[], taskId: string, actualLineId: string): Promise<IProductionOrder[]> {
        const data = [];
        const t = await sequelize.transaction();
        for (const po of poPayload) {
            const schedule = await this._scheduleRepository.findByIdCanNull(po.scheduleId, t);
            if (!schedule) {
                const manualPO = await this._poRepository.findByIdCanNull(po.scheduleId, t);
                if (!manualPO) {
                    await t.rollback();
                    throw new AppError({
                        statusCode: HttpCode.BAD_REQUEST,
                        description: "Schedule Id not found",
                    });
                }
                continue;
            }
            if (schedule.status === "closed") {
                await t.rollback();
                throw new AppError({
                    statusCode: HttpCode.BAD_REQUEST,
                    description: "Schedule / PO has already closed",
                });
            }
            if (po.qty > schedule.balance) {
                await t.rollback();
                throw new AppError({
                    statusCode: HttpCode.BAD_REQUEST,
                    description: "Production quantity can't exceed remaining qty",
                });
            }
            const createdPO = await this._poRepository.storeTransaction(
                ProductionOrder.create({
                    taskId,
                    scheduleId: schedule.id,
                    actualLineId,
                    purpose: po.purpose,
                    qty: po.qty,
                    status: "pending",
                    actualOutput: 0,
                    ngCount: 0,
                    cycleTime: 0,
                }),
                t
            );
            data.push(createdPO.unmarshal());
            await this._scheduleRepository.updateTransaction(
                schedule.id,
                {
                    id: schedule.id,
                    partId: schedule.partId,
                    lineId: schedule.lineId,
                    poNumber: schedule.poNumber,
                    startDate: schedule.startDate,
                    endDate: schedule.endDate,
                    qty: schedule.qty,
                    balance: schedule.balance - po.qty,
                    status: schedule.balance - po.qty === 0 ? "closed" : schedule.status,
                },
                t
            );
        }
        await t.commit();
        return data;
    }

    public async getListedEquipment(taskId: string): Promise<IListEquipmentHmi[]> {
        const production_orders = await this._poRepository.findRunningWithEquipment(taskId);
        const data = production_orders.map((po) => {
            const equipment = po.part !== null ? po.part?.equipment : po.schedule?.part?.equipment;

            return equipment?.map((el) => ({
                id: el.id,
                equipmentName: el.name,
                equipmentNumber: el.no_equipment,
            }));
        });
        const arr = data.flat();
        const newArr = [...arr];
        const newData: IListEquipmentHmi[] = [];
        for (const item of arr) {
            const filter = newArr.filter((el) => el?.id === item?.id);
            if (filter.length !== 1) {
                const data = item;
                if (!newData.find((el) => el.id === data?.id))
                    newData.push({
                        id: data?.id || "",
                        equipmentName: data?.equipmentName || "",
                        equipmentNumber: data?.equipmentNumber || "",
                    });
            } else {
                newData.push({
                    id: item?.id || "",
                    equipmentName: item?.equipmentName || "",
                    equipmentNumber: item?.equipmentNumber || "",
                });
            }
        }
        const set: IListEquipmentHmi[] = [...new Set(newData)];
        return set;
    }

    public async getUnlistredEquipment(taskId: string, q: string): Promise<IListEquipmentHmi[]> {
        const production_orders = await this._poRepository.findRunningWithEquipment(taskId);
        const partIds = production_orders.map((el) => (el.schedule ? el.schedule.part?.id : el.part?.id));
        const equipments = await this._equipmentRepository.findAllNotInParts(partIds, q);
        return equipments.map((el) => ({
            id: el.id ?? "",
            equipmentName: el.name ?? "",
            equipmentNumber: el.no_equipment ?? "",
        }));
    }

    public async setEquipment(equipmentPayload: IPayloadEquipmentHmi[], taskId: string): Promise<IProductionEquipment[]> {
        const data: IProductionEquipment[] = [];
        const t = await sequelize.transaction();
        for (const payload of equipmentPayload) {
            const equipment = await this._equipmentRepository.findByIdCanNull(payload.equipmentId, t);
            if (!equipment) {
                await t.rollback();
                throw new AppError({
                    statusCode: HttpCode.BAD_REQUEST,
                    description: "Equipment Id not found",
                });
            }
            const productionEquipment = await this._prodEquipmentRepository.store(
                ProductionEquipment.create({
                    taskId,
                    equipmentId: payload.equipmentId,
                    partId: equipment.part_id,
                    note: payload.note,
                    isChanged: false,
                    isActive: true,
                }),
                t
            );
            data.push({
                id: productionEquipment.id,
                taskId: productionEquipment.taskId,
                equipmentId: productionEquipment.equipmentId,
                partId: productionEquipment.partId,
                note: productionEquipment.note,
                isChanged: productionEquipment.isChanged,
                isActive: productionEquipment.isActive,
            });
        }
        await t.commit();
        return data;
    }

    public async getManpowers(machineId: string): Promise<IListManpowerHmi[]> {
        const manpowers = await this._manpowerRepository.findAllByMachine(machineId);
        return manpowers.map((el) => ({
            id: el.id,
            name: el.fullname,
            position: el.position?.name || "",
        }));
    }

    public async setManpower(manpowerPayload: IPayloadManpowerHmi[], taskId: string): Promise<IProductionManpower[]> {
        const data: IProductionManpower[] = [];
        const t = await sequelize.transaction();
        for (const payload of manpowerPayload) {
            const manpower = await this._manpowerRepository.findByIdCanNull(payload.id, t);
            if (!manpower) {
                await t.rollback();
                throw new AppError({
                    statusCode: HttpCode.BAD_REQUEST,
                    description: "Schedule Id not found",
                });
            }
            const production_manpower = await this._prodManpowerRepository.store(
                ProductionManpower.create({
                    taskId,
                    manpowerId: manpower.id,
                    indicator: payload.indicator,
                    isActive: payload.indicator === "absent" ? false : true,
                })
            );
            data.push({
                id: production_manpower.id,
                taskId: production_manpower.taskId,
                manpowerId: production_manpower.manpowerId,
                indicator: production_manpower.indicator,
                isActive: production_manpower.isActive,
            });
        }
        await t.commit();
        return data;
    }
}
