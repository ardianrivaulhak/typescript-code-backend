import { TDataTableParam } from "@/domain/service/types";
import { IPosition, Position } from "../models/position";
import { TableData } from "../models/table-data";

export interface PositionRepository {
  findAll(): Promise<Position[]>;
  findById(problem_id: string): Promise<Position>;
  getDataTable(param: TDataTableParam): Promise<TableData<IPosition>>;
  store(problem: Position): Promise<Position>;
  update(problem_id: string, problem: IPosition): Promise<void>;
  destroy(problem_id: string): Promise<boolean>;
}
