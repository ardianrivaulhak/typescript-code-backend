import { Defects, IDefects } from "@/domain/models/defects";
import { injectable, inject } from "inversify";
import { DefectsRepository } from "@/domain/service/depects-repository";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { FileSystem } from "@/infrastructure/file-system";
import { TYPES } from "@/types";
import * as XLSX from "xlsx";
import { convertToExcel } from "@/presentation/middleware/convertExcel";
@injectable()
export class DefectsService {
    constructor(
        @inject(TYPES.DepectsRepository)
        private _depectsRepository: DefectsRepository
    ) {}

    public async findAll(): Promise<IDefects[]> {
        const depects = await this._depectsRepository.findAll();

        const depectsDto = depects.map((prob) => {
            return {
                id: prob.id,
                name: prob.name,
            };
        });

        const excelData = convertToExcel(depectsDto);

        const excelBuffer = XLSX.write(excelData, { type: "buffer" });

        return excelBuffer;
    }

    public async findById(depects_id: string): Promise<IDefects> {
        const defects = await this._depectsRepository.findById(depects_id);
        return defects.unmarshal();
    }

    public async store(_depects: IDefects): Promise<IDefects> {
        const depEntity = Defects.create(_depects);

        const depects = await this._depectsRepository.store(depEntity);
        return depects.unmarshal();
    }

    public async update(_depects: IDefects, depects_id: string): Promise<void> {
        const depEntity = Defects.create(_depects);

        await this._depectsRepository.update(depects_id, depEntity);
    }

    public async destroy(depects_id: string): Promise<boolean> {
        await this._depectsRepository.destroy(depects_id);
        return true;
    }
    public async getDataTable(param: TDataTableParamFilter): Promise<ITableData<IDefects>> {
        const dataTable = await this._depectsRepository.getDataTable(param);

        return dataTable.unmarshal();
    }

    public async importExcel(file: Express.Multer.File): Promise<void> {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data: IDefects[] = XLSX.utils.sheet_to_json(worksheet);
        const problemEntities: Defects[] = await Promise.all(data.map(async (depects) => Defects.create(depects)));
        const importedProblems: IDefects[] = problemEntities.map((entity) => entity.unmarshal());
        await this._depectsRepository.import(problemEntities);
    }

    public async pagination(param: TPagination): Promise<ITableData<IDefects>> {
        const dataTable = await this._depectsRepository.pagination(param);
        return dataTable.unmarshal();
    }
}
