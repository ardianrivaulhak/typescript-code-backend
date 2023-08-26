import { Machine, IMachine } from "@/domain/models/machine";
import { injectable, inject } from "inversify";
import { MachineRepository } from "@/domain/service/machine-repository";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { FileSystem } from "@/infrastructure/file-system";
import { TYPES } from "@/types";
import { IListMachine, IListMachineForParam } from "@/dto/machine-dto";
import * as XLSX from "xlsx";
import { convertToExcel } from "@/presentation/middleware/convertExcel";
import { LineRepository } from "@/domain/service/line-repository";
import { HttpCode, AppError } from "@/libs/exceptions/app-error";
@injectable()
export class MachineService {
    constructor(
        @inject(TYPES.MachineRepository)
        private _machineRepository: MachineRepository,
        @inject(TYPES.LineRepository)
        private _lineRepo: LineRepository
    ) {}

    public async findAll(): Promise<IListMachine[]> {
        const machines = await this._machineRepository.findAll();

        const machinesDto: IListMachine[] = machines.map((el) => {
            return {
                machine_id: el.id,
                no_machine: el.no_machine,
                machine_name: el.name,
                no_line: el.line?.no_line,
                line_name: el.line?.name,
            };
        });

        const excelData = convertToExcel(machinesDto);

        const excelBuffer = XLSX.write(excelData, { type: "buffer" });

        return excelBuffer;
    }

    public async findById(machine_id: string): Promise<IMachine> {
        const machine = await this._machineRepository.findById(machine_id);
        return machine.unmarshal();
    }

    public async store(_machine: IMachine): Promise<IMachine> {
        const line = await this._lineRepo.findById(_machine.line_id);

        if (!line) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Line was not found",
            });
        }
        const depEntity = Machine.create(_machine);

        const depects = await this._machineRepository.store(depEntity);
        return depects.unmarshal();
    }

    public async update(_machine: IMachine, machine_id: string): Promise<void> {
        const line = await this._lineRepo.findById(_machine.line_id);

        if (!line) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Line was not found",
            });
        }
        const depEntity = Machine.create(_machine);

        await this._machineRepository.update(machine_id, depEntity);
    }

    public async destroy(machine_id: string): Promise<boolean> {
        await this._machineRepository.destroy(machine_id);
        return true;
    }

    public async getDataTable(param: TDataTableParamFilter): Promise<ITableData<IMachine>> {
        const dataTable = await this._machineRepository.getDataTable(param);
        return dataTable.unmarshal();
    }

    public async importExcel(file: Express.Multer.File): Promise<void> {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data: IMachine[] = XLSX.utils.sheet_to_json(worksheet);
        const entities: Machine[] = await Promise.all(data.map(async (lines) => Machine.create(lines)));
        const imported: IMachine[] = entities.map((entity) => entity.unmarshal());
        await this._machineRepository.import(entities);
    }

    public async getAll(): Promise<IListMachineForParam[]>{
        const machines = await this._machineRepository.findAll();

        const machineDto: IListMachineForParam[] = machines.map((el) => {
            return {
                machine_id: el.id,
                machine_name: el.name,
            };
        });
        return machineDto;
    }

    public async pagination(param: TPagination): Promise<ITableData<IMachine>> {
        const dataTable = await this._machineRepository.pagination(param);
        return dataTable.unmarshal();
    }
    
}
