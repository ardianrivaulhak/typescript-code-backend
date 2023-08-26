import { IProductionDefect, ProductionDefect } from "@/domain/models/production-defect";
import { ProductionDefectRepository } from "@/domain/service/production-defect-repository";
import { IListProductionDefect } from "@/dto/production-defect-dto";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import moment from "moment";

@injectable()
export class ProductionDefectService {
    constructor(@inject(TYPES.ProductionDefectRepository) private _prodDefectlemRepository: ProductionDefectRepository) {}

    public async findAllByPOId(productionOrderId: string): Promise<IListProductionDefect[]> {
        const data = await this._prodDefectlemRepository.findAllByPO(productionOrderId);
        return data.map((el) => {
            return {
                id: el.id,
                timestamp: moment(el.date).format("DD/MM/YYYY, hh:mm"),
                qty: el.qty,
                defectType: el.defect?.name ?? "",
                remark: el.remark,
            };
        });
    }

    public async store(payload: IProductionDefect): Promise<IProductionDefect> {
        const poProblem = await this._prodDefectlemRepository.store(
            ProductionDefect.create({
                productionOrderId: payload.productionOrderId,
                defectId: payload.defectId,
                date: payload.date,
                qty: payload.qty,
                remark: payload.remark,
            })
        );

        return poProblem;
    }

    public async destroy(productionDefectId: string): Promise<void> {
        await this._prodDefectlemRepository.destroy(productionDefectId);
        return;
    }
}
