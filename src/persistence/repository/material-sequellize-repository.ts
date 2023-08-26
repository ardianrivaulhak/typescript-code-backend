import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { Material, Part } from "@/infrastructure/database/models";
import { MaterialRepository } from "@/domain/service/material-repository";
import { Material as EntityMaterial, IMaterial } from "@/domain/models/material";
import { Op, Order, Transaction } from "sequelize";
@injectable()
export class MaterialSequelizeRepository implements MaterialRepository {
    async findAll(): Promise<EntityMaterial[]> {
        const lines = await Material.findAll({
            include: {
                model: Part,
                attributes: ["id", "no_part", "name"],
            },
        });
        return lines.map((el) =>
            EntityMaterial.create({
                id: el.id,
                part_id: el.part_id,
                no_material: el.no_material,
                name: el.name,
                qty: el.qty,
                part: el.part,
            })
        );
    }
    async findAllByPartId(partId: string): Promise<EntityMaterial[]> {
        const materials = await Material.findAll({
            where: {
                part_id: partId,
            },
        });
        return materials.map((el) =>
            EntityMaterial.create({
                id: el.id,
                part_id: el.part_id,
                no_material: el.no_material,
                name: el.name,
                qty: el.qty,
            })
        );
    }
    async findAllByPartIdBulk(partId: string[], transaction?: Transaction): Promise<EntityMaterial[]> {
        const materials = await Material.findAll({
            where: {
                part_id: {
                    [Op.in]: partId,
                },
            },
            ...(transaction && { transaction }),
        });
        return materials.map((el) =>
            EntityMaterial.create({
                id: el.id,
                part_id: el.part_id,
                no_material: el.no_material,
                name: el.name,
                qty: el.qty,
            })
        );
    }
    async findById(material_id: string): Promise<EntityMaterial> {
        const material = await Material.findByPk(material_id, {
            include: {
                model: Part,
                attributes: ["id", "no_part", "name"],
            },
        });

        if (!material) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Material not found",
            });
        }

        return EntityMaterial.create({
            id: material.id,
            part_id: material.part_id,
            no_material: material.no_material,
            name: material.name,
            qty: material.qty,
            part: material.part,
        });
    }
    async getDataTable(param: TDataTableParamFilter): Promise<TableData<IMaterial>> {
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

        const materials = await Material.findAndCountAll({
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

        const totalPages = Math.ceil(materials.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: materials.rows.map((item) => ({
                id: item.id,
                part_id: item.part_id,
                no_material: item.no_material,
                name: item.name,
                qty: item.qty,
                part: item.part,
            })),
            totalRows: materials.count,
            totalPages: Math.ceil(materials.count / (param.limit || 10)),
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async pagination(param: TPagination): Promise<TableData<IMaterial>> {
        let order: Order | undefined;
        if(param.filter){
            const orderBy = param.filter.orderBy ?? "created_at";
            const sortBy = param.filter.sortBy ?? "desc";
            order = [[orderBy, sortBy]];
        }

        const materials = await Material.findAndCountAll({
            include: [
                {
                    model:Part,
                    attributes: ["id", "no_part", "name"],
                }
            ],
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalPages = Math.ceil(materials.count / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;

        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: materials.rows.map((item) => ({
                id: item.id,
                part_id: item.part_id,
                no_material: item.no_material,
                name: item.name,
                qty: item.qty,
                part: item.part,
            })),
            totalRows: materials.count,
            totalPages: Math.ceil(materials.count / (param.limit || 10)),
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async store(_mat: EntityMaterial): Promise<EntityMaterial> {
        const t = await sequelize.transaction();
        try {
            const material = await Material.create(
                {
                    id: _mat.id,
                    part_id: _mat.part_id,
                    no_material: _mat.no_material,
                    name: _mat.name,
                    qty: _mat.qty,
                },
                { transaction: t }
            );

            await t.commit();

            const entity = EntityMaterial.create({
                id: material.id,
                part_id: material.part_id,
                no_material: material.no_material,
                name: material.name,
                qty: material.qty,
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
    async update(material_id: string, _material: IMaterial): Promise<void> {
        const material = await Material.findByPk(material_id);

        if (!material) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Material not found",
            });
        }

        await material.update({
            part_id: _material.part_id,
            no_material: _material.no_material,
            name: _material.name,
            qty: _material.qty,
        });
        await material.reload();
    }
    async destroy(material_id: string): Promise<boolean> {
        const material = await Material.findByPk(material_id);

        if (!material) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Material not found",
            });
        }
        await material.destroy();
        return true;
    }

    async import(materials: IMaterial[]): Promise<EntityMaterial[]> {
        const t = await sequelize.transaction();
        try {
            const createdEntities: EntityMaterial[] = [];

            for (const material of materials) {
                const p = await Material.create(
                    {
                        id: material.id,
                        part_id: material.part_id,
                        no_material: material.no_material,
                        name: material.name,
                        qty: material.qty,
                    },
                    { transaction: t }
                );

                const entityProblem = EntityMaterial.create({
                    id: p.id,
                    part_id: p.part_id,
                    no_material: p.no_material,
                    name: p.name,
                    qty: p.qty,
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                    deletedAt: p.deletedAt,
                });

                createdEntities.push(entityProblem);
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
}
