import { ProductionDefect, Depects } from "@/infrastructure/database/models";
import { ProductionDefect as EntityProductionDefect, IProductionDefect } from "@/domain/models/production-defect";
import { injectable } from "inversify";
import { ProductionDefectRepository } from "@/domain/service/production-defect-repository";
import moment from "moment";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";

@injectable()
export class ProductionDefectSequelizeRepository implements ProductionDefectRepository {
    async store(domain: EntityProductionDefect): Promise<IProductionDefect> {
        const data = await ProductionDefect.create({
            id: domain.id,
            productionOrderId: domain.productionOrderId,
            defectId: domain.defectId,
            date: domain.date,
            qty: domain.qty,
            remark: domain.remark,
        });
        const entity = EntityProductionDefect.create({
            id: data.id,
            productionOrderId: data.productionOrderId,
            defectId: data.defectId,
            date: data.date,
            qty: data.qty,
            remark: data.remark,
        });
        return entity.unmarshal();
    }

    async findAllByPO(productionOrderId: string): Promise<IProductionDefect[]> {
        const data = await ProductionDefect.findAll({
            where: {
                productionOrderId,
            },
            include: {
                model: Depects,
                as: "defect",
            },
        });
        return data.map((el) => ({
            id: el.id,
            productionOrderId: el.productionOrderId,
            defectId: el.defectId,
            date: el.date,
            qty: el.qty,
            remark: el.remark,
            defect: el.defect,
        }));
    }

    async destroy(productionDefectId: string): Promise<void> {
        const poDefect = await ProductionDefect.findByPk(productionDefectId);
        if (!poDefect) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Production Defect is not found",
            });
        }
        await poDefect.destroy();
        return;
    }
}
