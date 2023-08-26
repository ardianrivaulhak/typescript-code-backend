import { IProductionEquipment, ProductionEquipment } from "../models/production-equipment";
import { Transaction } from "sequelize";

export interface ProductionEquipmentRepository {
    store(domain: ProductionEquipment, transaction?: Transaction): Promise<IProductionEquipment>;
}
