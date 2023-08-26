import { ProductionDefect, IProductionDefect } from "../models/production-defect";

export interface ProductionDefectRepository {
    store(domain: ProductionDefect): Promise<IProductionDefect>;
    findAllByPO(productionOrderId: string): Promise<IProductionDefect[]>;
    destroy(productionDefectId: string): Promise<void>;
}
