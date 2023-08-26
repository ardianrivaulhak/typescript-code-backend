import { IProductionOrder, ProductionOrder } from "@/domain/models/production_order";
import { ProductionOrderRepository } from "@/domain/service/production-order-repository";
import { IProductionOrderSelection } from "@/dto/production-order-dto";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";

@injectable()
export class PreparationService {
    constructor(@inject(TYPES.ProductionOrderRepository) private _poRepository: ProductionOrderRepository) {}

    public async getSelectionPO(taskId: string): Promise<IProductionOrderSelection[]> {
        const data = await this._poRepository.findAllWithSchedulePartByTaskId(taskId);
        return data.map((el) => {
            const partNumber = el.schedule ? el.schedule.part?.no_part : el.part?.no_part;
            return {
                id: el.id,
                poNumber: el.schedule?.poNumber ?? "",
                partNumber: partNumber ?? "",
                qty: el.qty,
            };
        });
    }

    public async startPO(poId: string): Promise<IProductionOrder> {
        const po = await this._poRepository.findById(poId);
        if (po.status !== "pending") {
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Task already running or completed",
            });
        }
        const updatedPOEntity = ProductionOrder.create({
            id: po.id,
            taskId: po.taskId,
            actualLineId: po.actualLineId,
            qty: po.qty,
            purpose: po.purpose,
            status: "running",
            actualOutput: po.actualOutput,
            ngCount: po.ngCount,
            cycleTime: po.cycleTime,
        });
        const updatedPO = await this._poRepository.update(po.id, updatedPOEntity);
        return updatedPO.unmarshal();
    }
}
