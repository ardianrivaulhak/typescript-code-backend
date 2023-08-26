import { IProductionProblem, ProductionProblem } from "@/domain/models/production-problem";
import { ProductionProblemRepository } from "@/domain/service/production-problem-repository";
import { IListProductionProblem } from "@/dto/production-problem-dto";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import moment from "moment";

@injectable()
export class ProductionProblemService {
    constructor(@inject(TYPES.ProductionProblemRepository) private _prodProblemRepository: ProductionProblemRepository) {}

    public async findAllByPOId(productionOrderId: string): Promise<IListProductionProblem[]> {
        const data = await this._prodProblemRepository.findAllByPO(productionOrderId);
        return data.map((el) => {
            return {
                id: el.id,
                time: el.time,
                problem: el.problem,
                remark: el.remark,
            };
        });
    }

    public async store(payload: IProductionProblem): Promise<IProductionProblem> {
        const poProblem = await this._prodProblemRepository.store(
            ProductionProblem.create({
                productionOrderId: payload.productionOrderId,
                problemId: payload.problemId,
                startTime: moment(payload.startTime).toDate(),
                finishTime: moment(payload.finishTime).toDate(),
                remark: payload.remark,
            })
        );

        return poProblem;
    }
}
