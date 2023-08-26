import { Manpower, IManpower } from "@/domain/models/manpower";
import { injectable, inject } from "inversify";
import { ManpowerRepository } from "@/domain/service/manpower-repository";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParam, TPagination } from "@/domain/service/types";
import { FileSystem } from "@/infrastructure/file-system";
import { TYPES } from "@/types";
import { convertToExcel } from "@/presentation/middleware/convertExcel";
import * as XLSX from "xlsx";
import { IListManpower } from "@/dto/manpower-dto";
import { MachineRepository } from "@/domain/service/machine-repository";
import { PositionRepository } from "@/domain/service/position-repository";
@injectable()
export class ManpowerService {
    constructor(
        @inject(TYPES.ManpowerRepository)
        private _manpowerRepository: ManpowerRepository,
        @inject(TYPES.MachineRepository)
        private _machineRepo: MachineRepository,
        @inject(TYPES.PositionRepository)
        private _positionRepo: PositionRepository
    ) {}

    public async findAll(): Promise<IListManpower[]> {
        const manpowers = await this._manpowerRepository.findAll();
        const manpowersDto: IListManpower[] = manpowers.map((el) => {
            return {
                id: el.id,
                fullname: el.fullname,
                shortname: el.shortname,
                nip: el.nip,
                machine_name: el.machine?.name,
                line_name: el.machine?.line?.name,
                position: el.position?.name,
            };
        });

        const excelData = convertToExcel(manpowersDto);

        const excelBuffer = XLSX.write(excelData, { type: "buffer" });

        return excelBuffer;
    }

    public async store(_machine: IManpower): Promise<IManpower> {
        await this._machineRepo.findById(_machine.machineId);
        await this._positionRepo.findById(_machine.positionId);
        const manEntity = Manpower.create(_machine);

        const manpower = await this._manpowerRepository.store(manEntity);
        return manpower.unmarshal();
    }

    public async update(_machine: IManpower, manpower_id: string): Promise<void> {
        const manEntity = Manpower.create(_machine);

        await this._manpowerRepository.update(manpower_id, manEntity);
    }

    public async destroy(manpower_id: string): Promise<boolean> {
        await this._manpowerRepository.destroy(manpower_id);
        return true;
    }

    public async getDataTable(param: TDataTableParam): Promise<ITableData<IManpower>> {
        const dataTable = await this._manpowerRepository.getDataTable(param);

        return dataTable.unmarshal();
    }

    public async findById(manpower_id: string): Promise<IManpower> {
        const manpower = await this._manpowerRepository.findById(manpower_id);

        return manpower.unmarshal();
    }

    public async importExcel(file: Express.Multer.File): Promise<void> {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data: IManpower[] = XLSX.utils.sheet_to_json(worksheet);
        const entities: Manpower[] = await Promise.all(data.map(async (manpower) => Manpower.create(manpower)));
        const imported: IManpower[] = entities.map((entity) => entity.unmarshal());
        await this._manpowerRepository.import(entities);
    }

    public async pagination(param: TPagination): Promise<ITableData<IManpower>> {
        const dataTable = await this._manpowerRepository.pagination(param);
        return dataTable.unmarshal();
    }
}
