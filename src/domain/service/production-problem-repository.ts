import { IListProductionProblem } from "@/dto/production-problem-dto";
import { IProductionProblem, ProductionProblem } from "../models/production-problem";

export interface ProductionProblemRepository {
    store(domain: ProductionProblem): Promise<IProductionProblem>;
    findAllByPO(productionOrderId: string): Promise<IListProductionProblem[]>;
}
