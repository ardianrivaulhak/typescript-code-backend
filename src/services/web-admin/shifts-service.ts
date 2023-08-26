import { Shifts, IShifts } from "@/domain/models/shifts";
import { injectable, inject } from "inversify";
import { ShiftsRepository } from "@/domain/service/shifts-repository";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { FileSystem } from "@/infrastructure/file-system";
import { TYPES } from "@/types";
import * as XLSX from "xlsx";
import { convertToExcel } from "@/presentation/middleware/convertExcel";
@injectable()
export class ShiftsService {
    constructor(
        @inject(TYPES.ShiftsRepository)
        private _shiftsRepository: ShiftsRepository
    ) {}

    public async findAll(): Promise<IShifts[]> {
        const shifts = await this._shiftsRepository.findAll();

        const shiftsDto = shifts.map((shif) => {
            return {
                id: shif.id,
                name: shif.name,
            };
        });

        const excelData = convertToExcel(shiftsDto);

        const excelBuffer = XLSX.write(excelData, { type: "buffer" });

        return excelBuffer;
    }

    public async findById(shifts_id: string): Promise<IShifts> {
        const shifts = await this._shiftsRepository.findById(shifts_id);
        return shifts.unmarshal();
    }

    public async store(_shifts: IShifts): Promise<IShifts> {
        const shifEntity = Shifts.create(_shifts);

        const shifts = await this._shiftsRepository.store(shifEntity);
        return shifts.unmarshal();
    }

    public async update(_shifts: IShifts, shifts_id: string): Promise<void> {
        const shifEntity = Shifts.create(_shifts);

        await this._shiftsRepository.update(shifts_id, shifEntity);
    }

    public async destroy(shifts_id: string): Promise<boolean> {
        await this._shiftsRepository.destroy(shifts_id);
        return true;
    }

    public async getDataTable(param: TDataTableParamFilter): Promise<ITableData<IShifts>> {
        const dataTable = await this._shiftsRepository.getDataTable(param);

        return dataTable.unmarshal();
    }

    public async importExcel(file: Express.Multer.File): Promise<void> {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data: IShifts[] = XLSX.utils.sheet_to_json(worksheet);
        const entities: Shifts[] = await Promise.all(data.map(async (depects) => Shifts.create(depects)));
        const imported: IShifts[] = entities.map((entity) => entity.unmarshal());
        await this._shiftsRepository.import(entities);
    }

    public async pagination(param: TPagination): Promise<ITableData<IShifts>> {
        const dataTable = await this._shiftsRepository.pagination(param);
        return dataTable.unmarshal();
    }
}
