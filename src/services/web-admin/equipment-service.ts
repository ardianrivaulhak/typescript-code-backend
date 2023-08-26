import { Equipment, IEquipment } from "@/domain/models/equipment";
import { injectable, inject } from "inversify";
import { EquipmentRepository } from "@/domain/service/equipment-repository";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { FileSystem } from "@/infrastructure/file-system";
import { TYPES } from "@/types";
import { IListProblem } from "@/dto/problem-dto";
import * as XLSX from "xlsx";
import { convertToExcel } from "@/presentation/middleware/convertExcel";
import { PartRepository } from "@/domain/service/part-repository";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
@injectable()
export class EquipmentService {
    constructor(
        @inject(TYPES.EquipmentRepository)
        private _equipRepository: EquipmentRepository,
        @inject(TYPES.PartRepository)
        private _partRepo: PartRepository
    ) {}

    public async findAll(): Promise<IEquipment[]> {
        const equipment = await this._equipRepository.findAll();

        const equipmentDto = equipment.map((el) => {
            return {
                id: el.id,
                part_id: el.part_id,
                name: el.name,
                no_equipment: el.no_equipment,
                part: el.part?.name,
            };
        });

        const excelData = convertToExcel(equipmentDto);

        const excelBuffer = XLSX.write(excelData, { type: "buffer" });

        return excelBuffer;
    }

    public async findById(equipment_id: string): Promise<IEquipment> {
        const equipment = await this._equipRepository.findById(equipment_id);
        return equipment.unmarshal();
    }

    public async store(_equipment: IEquipment): Promise<IEquipment> {
        await this._partRepo.findById(_equipment.part_id);

        const entity = Equipment.create(_equipment);

        const problem = await this._equipRepository.store(entity);
        return problem.unmarshal();
    }

    public async update(_equipment: IEquipment, equipment_id: string): Promise<void> {
        await this._partRepo.findById(_equipment.part_id);

        const entity = Equipment.create(_equipment);

        await this._equipRepository.update(equipment_id, entity);
    }

    public async destroy(equipment_id: string): Promise<boolean> {
        await this._equipRepository.destroy(equipment_id);
        return true;
    }

    public async getDataTable(param: TDataTableParamFilter): Promise<ITableData<IEquipment>> {
        const dataTable = await this._equipRepository.getDataTable(param);

        return dataTable.unmarshal();
    }

    public async importExcel(file: Express.Multer.File): Promise<void> {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data: IEquipment[] = XLSX.utils.sheet_to_json(worksheet);
        const entities: Equipment[] = await Promise.all(data.map(async (equipments) => Equipment.create(equipments)));
        const imported: IEquipment[] = entities.map((entity) => entity.unmarshal());
        await this._equipRepository.import(entities);
    }

    public async pagination(param: TPagination): Promise<ITableData<IEquipment>> {
        const dataTable = await this._equipRepository.pagination(param);
        return dataTable.unmarshal();
    }
}
