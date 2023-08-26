import { ISchedule, Schedule } from "@/domain/models/schedule";
import { ScheduleRepository } from "@/domain/service/schedule-repository";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParam } from "@/domain/service/types";

@injectable()
export class ScheduleService {
    constructor(@inject(TYPES.ScheduleRepository) private _repository: ScheduleRepository) {}

    public async findAll(): Promise<ISchedule[]> {
        const schedules = await this._repository.findAll();
        const dataDto = schedules.map((schedule) => schedule.unmarshal());
        return dataDto;
    }

    public async findById(id: string): Promise<ISchedule> {
        const schedule = await this._repository.findById(id);
        return schedule.unmarshal();
    }

    public async store(_schedule: ISchedule): Promise<ISchedule> {
        const schedule = await this._repository.store(
            Schedule.create({
                partId: _schedule.partId,
                lineId: _schedule.lineId,
                poNumber: _schedule.poNumber,
                startDate: _schedule.startDate,
                endDate: _schedule.endDate,
                qty: _schedule.qty,
                balance: _schedule.balance,
                status: _schedule.status,
            })
        );
        return schedule.unmarshal();
    }

    public async update(id: string, _schedule: ISchedule): Promise<ISchedule> {
        const toUpdateSchedule = Schedule.create({
            partId: _schedule.partId,
            lineId: _schedule.lineId,
            poNumber: _schedule.poNumber,
            startDate: _schedule.startDate,
            endDate: _schedule.endDate,
            qty: _schedule.qty,
            balance: _schedule.balance,
            status: _schedule.status,
        });
        const schedule = await this._repository.update(id, toUpdateSchedule);
        return schedule.unmarshal();
    }

    public async destroy(id: string): Promise<boolean> {
        await this._repository.destroy(id);
        return true;
    }

    public async getDataTable(param: TDataTableParam): Promise<ITableData<ISchedule>> {
        const { data, limit, page, search } = await this._repository.getDataTable(param);
        const totalPages = Math.ceil(data.length / (param.limit || 10));
        const nextPage = param.page === totalPages ? null : totalPages > 1 ? <number>param.page + 1 : null;
        const prevPage = param.page === 1 ? null : <number>param.page - 1;
        const dataTable = {
            page,
            limit,
            search,
            data: data.map((el) => {
                return {
                    id: el.id,
                    partId: el.partId,
                    lineId: el.lineId,
                    poNumber: el.poNumber,
                    startDate: el.startDate,
                    endDate: el.endDate,
                    qty: el.qty,
                    balance: el.balance,
                    status: el.status,
                };
            }),
            totalPages: totalPages,
            totalRows: data.length,
            nextPages: <number>nextPage,
            prevPages: <number>prevPage,
        };
        return dataTable;
    }
}
