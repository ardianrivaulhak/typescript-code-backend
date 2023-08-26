import { ProductionOrderRepository } from "@/domain/service/production-order-repository";
import { MethodRepository } from "@/domain/service/method-repository";
import { IListMethodHMI, IListMethodLogHMI } from "@/dto/method-dto";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import { IPaginationData, PaginationData } from "@/domain/models/pagination-data";
import { TPaginationParam } from "@/domain/service/types";
import { IMethodLog, MethodLog } from "@/domain/models/method-log";
import { MethodLogRepository } from "@/domain/service/method-log-repository";
import moment from "moment";

@injectable()
export class MethodHmiService {
    constructor(
        @inject(TYPES.ProductionOrderRepository) private _poRepository: ProductionOrderRepository,
        @inject(TYPES.MethodRepository) private _methodRepository: MethodRepository,
        @inject(TYPES.MethodLogRepository) private _methodLogRepository: MethodLogRepository
    ) {}

    public async getAllMethods(poId: string, param: TPaginationParam): Promise<IPaginationData<IListMethodHMI>> {
        const po = await this._poRepository.findByIdWithScheduleAndPart(poId);
        const partId = po.schedule ? po.schedule.part?.id : po.part?.id;
        const methods = await this._methodRepository.findAllByPartId(partId ?? "", param);
        return methods.unmarshal();
    }

    public async addRemark(taskId: string, payload: any): Promise<IMethodLog> {
        const methodLog = await this._methodLogRepository.store(
            MethodLog.create({
                taskId,
                reportBy: payload.reportBy,
                remark: payload.remark,
                logTime: moment().toDate(),
            })
        );

        return {
            id: methodLog.id,
            taskId: methodLog.taskId,
            reportBy: methodLog.reportBy,
            remark: methodLog.remark,
            logTime: methodLog.logTime,
        };
    }

    public async getLog(taskId: string): Promise<IListMethodLogHMI[]> {
        const logs = await this._methodLogRepository.findAllByTaskId(taskId);
        return logs.map((el)=>({
            id: el.id,
            remark:el.remark,
            reportby: el.reportBy,
            timestamp: moment(el.logTime).format("DD/MM/YYYY, hh:mm")
        }));
    }
}
