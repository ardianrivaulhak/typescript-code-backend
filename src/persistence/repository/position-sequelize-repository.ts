import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { injectable } from "inversify";
import { sequelize } from "@/infrastructure/database/sequelize";
import { TableData } from "@/domain/models/table-data";
import { TDataTableParamFilter } from "@/domain/service/types";
import { Position } from "@/infrastructure/database/models";
import { PositionRepository } from "@/domain/service/position-repository";
import { Position as EntityPosition, IPosition } from "@/domain/models/position";
import { Op, Order } from "sequelize";

@injectable()
export class PositionSequelizeRepository implements PositionRepository {
  async findAll(): Promise<EntityPosition[]> {
    const position = await Position.findAll();
    return position.map((el) =>
      EntityPosition.create({
        id: el.id,
        name: el.name,
        createdAt: el.created_at,
        updatedAt: el.updated_at,
        deletedAt: el.deleted_at,
      })
    );
  }
  async findById(position_id: string): Promise<EntityPosition> {
    const position = await Position.findByPk(position_id);

    if (!position) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Position not found",
      });
    }

    return EntityPosition.create({
      id: position.id,
      name: position.name,
      createdAt: position.created_at,
      updatedAt: position.updated_at,
      deletedAt: position.deleted_at,
    });
  }
  async getDataTable(param: TDataTableParamFilter): Promise<TableData<IPosition>> {
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

    const positions = await Position.findAndCountAll({
      where: {
        name: {
          [Op.iLike]: `%${param.search || ""}%`,
        },
      },
      order: order,
      limit: param.limit ? param.limit : undefined,
      offset: (param.page || 1) > 1 ? (param.limit || 10) * ((param.page || 1) - 1) : 0,
    });

    const totalPages = Math.ceil(positions.count / (param.limit || 10));
    const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
    const prevPage = param.page === 1 ? null : <number>param.page - 1;

    return TableData.create({
      page: param.page || 1,
      limit: param.limit || 10,
      search: param.search || "",
      data: positions.rows.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        deletedAt: item.deleted_at,
      })),
      totalRows: positions.count,
      totalPages: Math.ceil(positions.count / (param.limit || 10)),
      nextPages: <number>nextPage,
      prevPages: <number>prevPage,
    });
  }

  async store(_position: IPosition): Promise<EntityPosition> {
    const t = await sequelize.transaction();

    try {
      const position = await Position.create(
        {
          id: _position.id,
          name: _position.name,
        },
        { transaction: t }
      );

      await t.commit();

      const entity = EntityPosition.create({
        id: position.id,
        name: position.name,
        createdAt: position.created_at,
        updatedAt: position.updated_at,
        deletedAt: position.deleted_at,
      });

      return entity;
    } catch (e) {
      await t.rollback();
      throw new AppError({
        statusCode: HttpCode.BAD_REQUEST,
        description: "Failed to create position",
        error: e,
      });
    }
  }

  async update(position_id: string, position: IPosition): Promise<void> {
    const p = await Position.findByPk(position_id);

    if (!p) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Position not found",
      });
    }

    await p.update({
      id: position.id,
      name: position.name,
    });
    await p.reload();
  }
  async destroy(position_id: string): Promise<boolean> {
    const position = await Position.findByPk(position_id);

    if (!position) {
      throw new AppError({
        statusCode: HttpCode.NOT_FOUND,
        description: "Position not found",
      });
    }
    await position.destroy();
    return true;
  }
}
