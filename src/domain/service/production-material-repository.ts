import { ProductionMaterial, IProductionMaterial } from "../models/production-material";
import { Transaction } from "sequelize";

export interface ProductionMaterialRepository {
    store(domain: ProductionMaterial, transaction?: Transaction): Promise<IProductionMaterial>;
    findAllByTaskId(taskId: string): Promise<IProductionMaterial[]>;
    findById(id: string, transaction?: Transaction): Promise<IProductionMaterial>;
    update(id: string, domain:ProductionMaterial, transaction?: Transaction): Promise<void>;
}