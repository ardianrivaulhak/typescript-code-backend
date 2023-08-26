import { TDataTableParam } from "@/domain/service/types";
import { ISchedule, Schedule } from "../models/schedule";
import { TableData } from "../models/table-data";
import { Transaction } from "sequelize";

export interface ScheduleRepository {
  findAll(): Promise<Schedule[]>;
  findById(id: string): Promise<Schedule>;
  findByIdCanNull(id: string, transaction?: Transaction): Promise<Schedule | undefined>;
  getDataTable(param: TDataTableParam): Promise<TableData<ISchedule>>;
  store(role: ISchedule): Promise<Schedule>;
  update(id: string, user: ISchedule): Promise<Schedule>;
  updateTransaction(id: string, user: ISchedule, transaction?: Transaction): Promise<Schedule | undefined>;
  destroy(id: string): Promise<boolean>;
  findToday(): Promise<Schedule[]>;
}
