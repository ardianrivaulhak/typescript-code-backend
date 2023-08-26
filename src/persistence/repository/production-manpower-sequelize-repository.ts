import { ProductionManpowerRepository } from "@/domain/service/production-manpower-repository";
import { ProductionManpower } from "@/infrastructure/database/models";
import { ProductionManpower as EntityProductionManpower, IProductionManpower } from "@/domain/models/production-manpower";
import { injectable } from "inversify";
import { Transaction } from "sequelize";

@injectable()
export class ProductionManpowerSequelizeRepository implements ProductionManpowerRepository {
    async store(domain: EntityProductionManpower, transaction?: Transaction): Promise<IProductionManpower> {
        const data = await ProductionManpower.create(
            {
                id: domain.id,
                taskId: domain.taskId,
                manpowerId: domain.manpowerId,
                indicator: domain.indicator,
                isActive: domain.isActive,
                createdAt: domain.createdAt,
                updatedAt: domain.updatedAt,
                deletedAt: domain.deletedAt,
            },
            {
                ...(transaction && { transaction }),
            }
        );
        return EntityProductionManpower.create({
            id: data.id,
            taskId: data.taskId,
            manpowerId: data.manpowerId,
            indicator: data.indicator,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
        });
    }
}
