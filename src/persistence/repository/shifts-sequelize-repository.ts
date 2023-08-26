import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { Shifts } from "@/infrastructure/database/models";
import { ShiftsRepository } from "@/domain/service/shifts-repository";
import { Shifts as EntityShifts, IShifts } from "@/domain/models/shifts";
import { Op, Order } from "sequelize";

@injectable()
export class ShiftsSequelizeRepository implements ShiftsRepository {
    async import(shifts: IShifts[]): Promise<EntityShifts[]> {
        const t = await sequelize.transaction();
        try {
            let createdEntities: EntityShifts[] = [];

            for (const shift of shifts) {
                const p = await Shifts.create(
                    {
                        id: shift.id,
                        name: shift.name,
                    },
                    { transaction: t }
                );

                const entity = EntityShifts.create({
                    id: p.id,
                    name: p.name,
                    createdAt: p.created_at,
                    updatedAt: p.updated_at,
                    deletedAt: p.deleted_at,
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
    async findAll(): Promise<EntityShifts[]> {
        const shifts = await Shifts.findAll();
        return shifts.map((el) =>
            EntityShifts.create({
                id: el.id,
                name: el.name,
                createdAt: el.created_at,
                updatedAt: el.updated_at,
                deletedAt: el.deleted_at,
            })
        );
    }
    async findById(shifts_id: string): Promise<EntityShifts> {
        const shifts = await Shifts.findByPk(shifts_id);

        if (!shifts) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Shifts not found",
            });
        }

        return EntityShifts.create({
            id: shifts.id,
            name: shifts.name,
            createdAt: shifts.created_at,
            updatedAt: shifts.updated_at,
            deletedAt: shifts.deleted_at,
        });
    }
    async getDataTable(param: TDataTableParamFilter): Promise<TableData<IShifts>> {
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
        const { rows: shifts, count: totalCount } = await Shifts.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order: order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalPages = Math.ceil(totalCount / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;
        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: shifts.map((item) => ({
                id: item.id,
                name: item.name,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                deletedAt: item.deleted_at,
            })),
            totalPages: totalPages,
            totalRows: totalCount,
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });
    }

    async pagination(param: TPagination): Promise<TableData<IShifts>> {
        let order: Order | undefined;
        if(param.filter){
            const orderBy = param.filter.orderBy ?? "created_at";
            const sortBy = param.filter.sortBy ?? "desc";
            order = [[orderBy, sortBy]];
        }

        const shifts = await Shifts.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${param.search || ""}%`,
                },
            },
            order,
            limit: param.limit ? param.limit : undefined,
            offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
        });

        const totalPages = Math.ceil(shifts.count  / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;
        return TableData.create({
            page: param.page || 1,
            limit: param.limit || 10,
            search: param.search || "",
            data: shifts.rows.map((item) => ({
                id: item.id,
                name: item.name,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                deletedAt: item.deleted_at,
            })),
            totalPages: totalPages,
            totalRows: shifts.count,
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        });

    }

    async store(shift: IShifts): Promise<EntityShifts> {
        const t = await sequelize.transaction();

        try {
            const shifts = await Shifts.create(
                {
                    id: shift.id,
                    name: shift.name,
                },
                { transaction: t }
            );

            await t.commit();

            const entity = EntityShifts.create({
                id: shifts.id,
                name: shifts.name,
                createdAt: shifts.created_at,
                updatedAt: shifts.updated_at,
                deletedAt: shifts.deleted_at,
            });

            return entity;
        } catch (e) {
            await t.rollback();
            throw new AppError({
                statusCode: HttpCode.BAD_REQUEST,
                description: "Failed to create defects",
                error: e,
            });
        }
    }

    async update(shifts_id: string, shift: IShifts): Promise<void> {
        const shifts = await Shifts.findByPk(shifts_id);

        if (!shifts) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Shifts not found",
            });
        }

        await shifts.update({
            id: shift.id,
            name: shift.name,
        });
        await shifts.reload();
    }
    async destroy(shifts_id: string): Promise<boolean> {
        const shifts = await Shifts.findByPk(shifts_id);

        if (!shifts) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Shifts not found",
            });
        }
        await shifts.destroy();
        return true;
    }
}
