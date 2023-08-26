import { ProductionMaterialRepository } from "@/domain/service/production-material-repository";
import { Material, ProductionMaterial, Task } from "@/infrastructure/database/models";
import { ProductionManpower as EntityProductionManpower, IProductionManpower } from "@/domain/models/production-manpower";
import { injectable } from "inversify";
import { Transaction } from "sequelize";
import { ProductionMaterial as EntityProductionMaterial, IProductionMaterial } from "@/domain/models/production-material";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";

@injectable()
export class ProductionMaterialSequelizeRepository implements ProductionMaterialRepository {
    // async store(domain: EntityProductionManpower, transaction?: Transaction): Promise<IProductionManpower> {
    //     const data = await ProductionManpower.create(
    //         {
    //             id: domain.id,
    //             taskId: domain.taskId,
    //             manpowerId: domain.manpowerId,
    //             indicator: domain.indicator,
    //             isActive: domain.isActive,
    //             createdAt: domain.createdAt,
    //             updatedAt: domain.updatedAt,
    //             deletedAt: domain.deletedAt,
    //         },
    //         {
    //             ...(transaction && { transaction }),
    //         }
    //     );
    //     return EntityProductionManpower.create({
    //         id: data.id,
    //         taskId: data.taskId,
    //         manpowerId: data.manpowerId,
    //         indicator: data.indicator,
    //         isActive: data.isActive,
    //         createdAt: data.createdAt,
    //         updatedAt: data.updatedAt,
    //         deletedAt: data.deletedAt,
    //     });
    // }
    async store(domain: EntityProductionMaterial, transaction?: Transaction): Promise<IProductionMaterial> {
        await ProductionMaterial.create(
            {
                id: domain.id,
                taskId: domain.taskId,
                materialId: domain.materialId,
                lotNo: domain.lotNo,
                remark: domain.remark,
            },
            {
                ...(transaction && { transaction }),
            }
        );
        return domain;
    }

    async findById(id: string, transaction?: Transaction): Promise<IProductionMaterial> {
        const prodMaterial = await ProductionMaterial.findByPk(id, { include: { model: Material }, ...(transaction && { transaction }) });
        if (!prodMaterial) {
            if (transaction) await transaction.rollback();
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Production Material not found",
            });
        }
        return EntityProductionMaterial.create({
            id: prodMaterial.id,
            taskId: prodMaterial.taskId,
            materialId: prodMaterial.materialId,
            lotNo: prodMaterial.lotNo,
            remark: prodMaterial.remark,
            material: prodMaterial.material,
        });
    }

    async findAllByTaskId(taskId: string): Promise<IProductionMaterial[]> {
        const prodMaterials = await ProductionMaterial.findAll({
            where: {
                taskId,
            },
            include: {
                model: Material,
            },
        });
        return prodMaterials.map((el) =>
            EntityProductionMaterial.create({
                id: el.id,
                taskId: el.taskId,
                materialId: el.materialId,
                lotNo: el.lotNo,
                remark: el.remark,
                material: el.material,
            })
        );
    }

    async update(id: string, domain: EntityProductionMaterial, transaction?: Transaction): Promise<void> {
        const prodMaterial = await ProductionMaterial.findByPk(id, { ...(transaction && { transaction }) });
        if (!prodMaterial) {
            if (transaction) await transaction.rollback();
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Production Material not found",
            });
        }
        await prodMaterial.update(
            {
                id: domain.id,
                taskId: domain.taskId,
                materialId: domain.materialId,
                lotNo: domain.lotNo,
                remark: domain.remark,
            },
            { ...(transaction && { transaction }) }
        );
        return;
    }
}
