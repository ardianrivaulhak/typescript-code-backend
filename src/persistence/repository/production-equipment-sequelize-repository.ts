import { ProductionEquipmentRepository } from "@/domain/service/production-equipment-repository";
import { ProductionEquipment } from "@/infrastructure/database/models";
import { ProductionEquipment as EntityProductEquipment, IProductionEquipment } from "@/domain/models/production-equipment";
import { injectable } from "inversify";
import { Transaction } from "sequelize";

@injectable()
export class ProductionEquipmentSequelizeRepository implements ProductionEquipmentRepository {
    async store(domain: EntityProductEquipment, transaction?: Transaction): Promise<IProductionEquipment> {
        const data = await ProductionEquipment.create(
            {
                id: domain.id,
                taskId: domain.taskId,
                equipmentId: domain.equipmentId,
                partId: domain.partId,
                note: domain.note,
                isChanged: domain.isChanged,
                isActive: domain.isActive,
                createdAt: domain.createdAt,
                updatedAt: domain.updatedAt,
                deletedAt: domain.deletedAt,
            },
            {
                ...(transaction && { transaction }),
            }
        );
        return EntityProductEquipment.create({
            id: data.id,
            taskId: data.taskId,
            equipmentId: data.equipmentId,
            partId: data.partId,
            note: data.note,
            isChanged: data.isChanged,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
        });
    }
}
