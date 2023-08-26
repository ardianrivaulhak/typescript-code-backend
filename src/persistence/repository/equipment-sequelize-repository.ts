import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { Equipment, Part } from "@/infrastructure/database/models";
import { EquipmentRepository } from "@/domain/service/equipment-repository";
import { Equipment as EntityEquipment, IEquipment } from "@/domain/models/equipment";
import { Op, Order, Transaction } from "sequelize";
@injectable()
export class EquipmentSequelizeRepository implements EquipmentRepository {
    async import(equipments: IEquipment[]): Promise<EntityEquipment[]> {
        const t = await sequelize.transaction();
        try {
            let createdEntities: EntityEquipment[] = [];

            for (const equipment of equipments) {
                const p = await Equipment.create(
                    {
                        id: equipment.id,
                        part_id: equipment.part_id,
                        name: equipment.name,
                        no_equipment: equipment.no_equipment,
                    },
                    { transaction: t }
                );

                const entity = EntityEquipment.create({
                    id: p.id,
                    part_id: p.part_id,
                    name: p.name,
                    no_equipment: p.no_equipment,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                    deletedAt: p.deletedAt,
                });

                createdEntities.push(entity);
            }

            await t.commit();
            return createdEntities;
        } catch (error) {
            await t.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create problem",
                error: error,
            });
        }
    }
    async findAll(): Promise<EntityEquipment[]> {
        const equipments = await Equipment.findAll({
            include: {
                model: Part,
                attributes: ["id", "no_part", "name"],
            },
        });

        return equipments.map((el) =>
            EntityEquipment.create({
                id: el.id,
                part_id: el.part_id,
                part: el.part,
                no_equipment: el.no_equipment,
                name: el.name,
            })
        );
    }

    async findById(equipment_id: string): Promise<EntityEquipment> {
        const equipment = await Equipment.findByPk(equipment_id, {
            include: {
                model: Part,
                attributes: ["id", "no_part", "name"],
            },
        });

        if (!equipment) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Equipment not found",
            });
        }

        return EntityEquipment.create({
            id: equipment.id,
            part_id: equipment.part_id,
            part: equipment.part,
            no_equipment: equipment.no_equipment,
            name: equipment.name,
        });
    }

    async findByIdCanNull(equipment_id: string, transaction?: Transaction): Promise<EntityEquipment | undefined> {
        const equipment = await Equipment.findByPk(equipment_id, {
            include: {
                model: Part,
                attributes: ["id", "no_part", "name"],
            },
            ...(transaction && { transaction }),
        });

        if (!equipment) return undefined;

        return EntityEquipment.create({
            id: equipment.id,
            part_id: equipment.part_id,
            part: equipment.part,
            no_equipment: equipment.no_equipment,
            name: equipment.name,
        });
    }

    async getDataTable(param: TDataTableParamFilter): Promise<TableData<IEquipment>> {
        let order: Order | undefined;

        switch (param.filterDate) {
            case "since-asc":
                order = [["created_at", "ASC"]];
                break;
            case "since-desc":
                order = [["created_at", "DESC"]];
                break;
            default:
                order = [["created_at", "DESC"]];
                break;
        }

        const equipments = await Equipment.findAndCountAll({
            include: {
                model: Part,
                attributes: ["id", "no_part", "name"],
            },
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order: order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalPages = Math.ceil(equipments.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: equipments.rows.map((item) => ({
                id: item.id,
                part_id: item.part_id,
                no_equipment: item.no_equipment,
                name: item.name,
                part: item.part,
            })),
            totalRows: equipments.count,
            totalPages: Math.ceil(equipments.count / (param.limit || 10)),
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async pagination(param: TPagination): Promise<TableData<IEquipment>> {
        let order: Order | undefined;
        if(param.filter){
            const orderBy = param.filter.orderBy ?? "created_at";
            const sortBy = param.filter.sortBy ?? "desc";
            order = [[orderBy, sortBy]];
        }

        const equipments = await Equipment.findAndCountAll({
            include:{
                model: Part,
                attributes: ["id", "no_part", "name"],
            },
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            attributes: ["id","name","no_equipment","part_id"],
            order: order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0
        });

        const totalPages = Math.ceil(equipments.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;


        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: equipments.rows.map((item) => ({
                id: item.id,
                part_id: item.part_id,
                no_equipment: item.no_equipment,
                name: item.name,
                part: item.part,
            })),
            totalRows: equipments.count,
            totalPages: Math.ceil(equipments.count / (param.limit || 10)),
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async store(equipment: EntityEquipment): Promise<EntityEquipment> {
        const t = await sequelize.transaction();
        try {
            const p = await Equipment.create(
                {
                    id: equipment.id,
                    part_id: equipment.part_id,
                    no_equipment: equipment.no_equipment,
                    name: equipment.name,
                },
                { transaction: t }
            );

            await t.commit();

            const entity = EntityEquipment.create({
                id: p.id,
                part_id: p.part_id,
                no_equipment: p.no_equipment,
                name: p.name,
            });

            return entity;
        } catch (e) {
            await t.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create problem",
                error: e,
            });
        }
    }
    async update(equipment_id: string, _equipment: IEquipment): Promise<void> {
        const equipment = await Equipment.findByPk(equipment_id);

        if (!equipment) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Equipment not found",
            });
        }

        await equipment.update({
            id: _equipment.id,
            part_id: _equipment.part_id,
            name: _equipment.name,
            no_equipment: _equipment.no_equipment,
        });
        await equipment.reload();
    }
    async destroy(equipment_id: string): Promise<boolean> {
        const equipment = await Equipment.findByPk(equipment_id);

        if (!equipment) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Equipment not found",
            });
        }
        await equipment.destroy();
        return true;
    }

    async findAllNotInParts(partIds: string[], q: string): Promise<IEquipment[]> {
        const equipments = await Equipment.findAll({
            where: {
                part_id: {
                    [Op.notIn]: partIds,
                },
                [Op.or]: [
                    {
                        name: {
                            [Op.iLike]: `%${q ?? ""}%`,
                        },
                    },
                    {
                        no_equipment: {
                            [Op.iLike]: `${q ?? ""}%`,
                        },
                    },
                ],
            },
        });

        return equipments.map((item) => ({
            id: item.id,
            part_id: item.part_id,
            no_equipment: item.no_equipment,
            name: item.name,
            part: item.part,
        }));
    }
}
