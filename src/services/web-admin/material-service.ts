import { Material, IMaterial } from "@/domain/models/material";
import { injectable, inject } from "inversify";
import { MaterialRepository } from "@/domain/service/material-repository";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParam, TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { FileSystem } from "@/infrastructure/file-system";
import { TYPES } from "@/types";
import { convertToExcel } from "@/presentation/middleware/convertExcel";
import * as XLSX from "xlsx";
import { IListMaterial } from "@/dto/material-dto";
import { PartRepository } from "@/domain/service/part-repository";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
@injectable()
export class MaterialService {
    constructor(
        @inject(TYPES.MaterialRepository)
        private _matpRepository: MaterialRepository,
        @inject(TYPES.PartRepository)
        private _partRepo: PartRepository
    ) {}

    public async findAll(): Promise<IListMaterial[]> {
        const materials = await this._matpRepository.findAll();

        const materialsDto: IListMaterial[] = materials.map((el) => {
            return {
                id: el.id!,
                no_material: el.no_material,
                name: el.name,
                qyt: el.qty,
                part_name: el.part?.name,
            };
        });

        const excelData = convertToExcel(materialsDto);

        const excelBuffer = XLSX.write(excelData, { type: "buffer" });

        return excelBuffer;
    }

    public async findById(equipment_id: string): Promise<IMaterial> {
        const material = await this._matpRepository.findById(equipment_id);
        return material.unmarshal();
    }

    public async store(_material: IMaterial): Promise<IMaterial> {
        await this._partRepo.findById(_material.part_id);

        const materialEntiry = Material.create(_material);

        const material = await this._matpRepository.store(materialEntiry);
        return material.unmarshal();
    }

    public async update(_material: IMaterial, material_id: string): Promise<void> {
        await this._partRepo.findById(_material.part_id);

        const materialEntiry = Material.create(_material);

        await this._matpRepository.update(material_id, materialEntiry);
    }

    public async destroy(material_id: string): Promise<boolean> {
        await this._matpRepository.destroy(material_id);
        return true;
    }

    public async getDataTable(param: TDataTableParamFilter): Promise<ITableData<IMaterial>> {
        const dataTable = await this._matpRepository.getDataTable(param);

        return dataTable.unmarshal();
    }

    public async importExcel(file: Express.Multer.File): Promise<void> {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data: IMaterial[] = XLSX.utils.sheet_to_json(worksheet);
        const entities: Material[] = await Promise.all(data.map(async (material) => Material.create(material)));
        const imported: IMaterial[] = entities.map((entity) => entity.unmarshal());
        await this._matpRepository.import(entities);
    }

    public async pagination(param: TPagination): Promise<ITableData<IMaterial>> {
        const dataTable = await this._matpRepository.pagination(param);
        return dataTable.unmarshal();
    }
}
