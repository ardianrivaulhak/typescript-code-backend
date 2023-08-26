import { IMaterialChangedLog, MaterialChangedLog } from "@/domain/models/material-changed-log";
import { IProductionMaterial, ProductionMaterial } from "@/domain/models/production-material";
import { IProductionOrder, ProductionOrder } from "@/domain/models/production_order";
import { MaterialChangedLogRepository } from "@/domain/service/material-changed-log-repository";
import { MaterialRepository } from "@/domain/service/material-repository";
import { ProductionEquipmentRepository } from "@/domain/service/production-equipment-repository";
import { ProductionManpowerRepository } from "@/domain/service/production-manpower-repository";
import { ProductionMaterialRepository } from "@/domain/service/production-material-repository";
import { ProductionOrderRepository } from "@/domain/service/production-order-repository";
import { IListMaterialHMI } from "@/dto/material-dto";
import { IProductionOrderSelection } from "@/dto/production-order-dto";
import { sequelize } from "@/infrastructure/database/sequelize";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import moment from "moment";

@injectable()
export class ProductionSupportService {
    constructor(
        @inject(TYPES.ProductionOrderRepository) private _poRepository: ProductionOrderRepository,
        @inject(TYPES.ProductionEquipmentRepository) private _prodEquipmentRepository: ProductionEquipmentRepository,
        @inject(TYPES.ProductionManpowerRepository) private _prodManpowerRepository: ProductionManpowerRepository,
        @inject(TYPES.MaterialRepository) private _materialRepository: MaterialRepository,
        @inject(TYPES.ProductionMaterialRepository) private _prodMaterialRepository: ProductionMaterialRepository,
        @inject(TYPES.MaterialChangedLogRepository) private _materialChangedLogRepository: MaterialChangedLogRepository
    ) {}

    public async getMaterials(taskId: string): Promise<IListMaterialHMI[]> {
        const materials = await this._prodMaterialRepository.findAllByTaskId(taskId ?? "");
        return materials.map((el) => ({
            id: el.id,
            no: el.material?.no_material ?? "",
            name: el.material?.name ?? "",
            qty: el.material?.qty ?? 0,
            lotNo: el.lotNo,
            remark: el.remark,
        }));
    }

    public async updateLotRemark(changedBy: string, payload: any): Promise<IMaterialChangedLog[]> {
        const data = [];
        const t = await sequelize.transaction();
        for (const i of payload) {
            const { id, remark, lotNo } = i;
            const prodMaterial = await this._prodMaterialRepository.findById(id, t);
            if (remark === prodMaterial.remark && lotNo === prodMaterial.lotNo) continue;
            await this._prodMaterialRepository.update(
                prodMaterial.id ?? "",
                ProductionMaterial.create({
                    id: prodMaterial.id,
                    taskId: prodMaterial.taskId,
                    materialId: prodMaterial.materialId,
                    lotNo: lotNo,
                    remark: remark,
                }),
                t
            );
            if (remark === prodMaterial.remark) continue;
            const log = await this._materialChangedLogRepository.store(
                MaterialChangedLog.create({
                    taskId: prodMaterial.taskId,
                    name: prodMaterial.material?.name ?? "",
                    from: prodMaterial.lotNo ?? "",
                    to: lotNo,
                    changedBy,
                    logTime: moment().toDate(),
                })
            );
            data.push({
                id: log.id,
                taskId: log.taskId,
                name: log.name,
                from: log.from,
                to: log.to,
                changedBy: log.changedBy,
                logTime: log.logTime,
            });
        }
        await t.commit();
        return data;
    }
}
