import { Problem, ProductionProblem } from "@/infrastructure/database/models";
import { ProductionProblem as EntityProductionProblem, IProductionProblem } from "@/domain/models/production-problem";
import { injectable } from "inversify";
import { ProductionProblemRepository } from "@/domain/service/production-problem-repository";
import { IListProductionProblem } from "@/dto/production-problem-dto";
import moment from "moment";

@injectable()
export class ProductionProblemSequelizeRepository implements ProductionProblemRepository {
    async store(domain: EntityProductionProblem): Promise<IProductionProblem> {
        const data = await ProductionProblem.create({
            id: domain.id,
            productionOrderId: domain.productionOrderId,
            problemId: domain.problemId,
            startTime: domain.startTime,
            finishTime: domain.finishTime,
            remark: domain.remark,
        });
        const entity = EntityProductionProblem.create({
            id: data.id,
            productionOrderId: data.productionOrderId,
            problemId: data.problemId,
            startTime: data.startTime,
            finishTime: data.finishTime,
            remark: data.remark,
        });
        return entity.unmarshal();
    }

    async findAllByPO(productionOrderId: string): Promise<IListProductionProblem[]> {
        const data = await ProductionProblem.findAll({
            where: {
                productionOrderId,
            },
            include: {
                model: Problem,
            },
        });
        return data.map((el) => {
            const start = moment(el.startTime);
            const finish = moment(el.finishTime);
            const duration = moment.duration(finish.diff(start));
            return {
                id: el.id,
                time:
                    duration.get("hours").toString().padStart(2, "0") +
                    ":" +
                    duration.get("minutes").toString().padStart(2, "0") +
                    ":" +
                    duration.get("seconds").toString().padStart(2, "0"),
                problem: el.problem?.name ?? "",
                remark: el.remark,
            };
        });
    }
}
