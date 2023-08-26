import { ProductionManpower, IProductionManpower } from "../models/production-manpower";
import { Transaction } from "sequelize";

export interface ProductionManpowerRepository {
    store(domain: ProductionManpower, transaction?: Transaction): Promise<IProductionManpower>;
}
