import { TDataTableParam } from "@/domain/service/types";
import { IProductionOrder, ProductionOrder } from "../models/production_order";
import { TableData } from "../models/table-data";
import { Transaction } from "sequelize";

export interface ProductionOrderRepository {
    findAll(): Promise<ProductionOrder[]>;
    findAllWithSchedulePartByTaskId(taskId: string): Promise<ProductionOrder[]>;
    findByIdWithScheduleAndPart(id: string): Promise<ProductionOrder>;
    findById(id: string): Promise<ProductionOrder>;
    findRunning(taskId: string): Promise<ProductionOrder | undefined>;
    findByIdCanNull(id: string, transaction?: Transaction): Promise<ProductionOrder | undefined>;
    getDataTable(param: TDataTableParam): Promise<TableData<IProductionOrder>>;
    store(po: IProductionOrder): Promise<ProductionOrder>;
    storeTransaction(po: IProductionOrder, transaction?: Transaction): Promise<ProductionOrder>;
    update(id: string, po: IProductionOrder): Promise<ProductionOrder>;
    destroy(id: string): Promise<boolean>;
    findCurrentManualPending(taskId: string): Promise<ProductionOrder[]>;
    findRunningWithEquipment(taskId: string): Promise<IProductionOrder[]>;
    findRunningWithMaterial(taskId: string): Promise<IProductionOrder[]>;
}
