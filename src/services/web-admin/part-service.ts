import { Part, IPart } from "@/domain/models/part";
import { injectable, inject } from "inversify";
import { PartRepository } from "@/domain/service/part-repository";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParam, TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { FileSystem } from "@/infrastructure/file-system";
import { TYPES } from "@/types";
import { ICreatePart, IListPart, IUpdatePart } from "@/dto/part-dto";
import { IPartHasMethod, PartHasMethod } from "@/domain/models/part_has_method";
import { convertToExcel } from "@/presentation/middleware/convertExcel";
import * as XLSX from "xlsx";
import { PartUpdateScheme } from "@/presentation/validation/part-validation";
import { LineRepository } from "@/domain/service/line-repository";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";

@injectable()
export class PartService {
    constructor(
        @inject(TYPES.PartRepository)
        private _partRepo: PartRepository,
        @inject(TYPES.LineRepository)
        private _lineRepo: LineRepository
    ) {}

    public async findAll(): Promise<IListPart[]> {
        const parts = await this._partRepo.findAll();

        const partDto = parts.map((el) => {
            return {
                id: el.id,
                name: el.name,
                no_part: el.no_part,
                cycle_time: el.cycle_time,
                line_name: el.line?.name,
                method_name: el.method[0].name,
            };
        });

        const excelData = convertToExcel(partDto);

        const excelBuffer = XLSX.write(excelData, { type: "buffer" });

        return excelBuffer;
    }

    public async findById(part_id: string): Promise<IPart> {
        const part = await this._partRepo.findById(part_id);
        return part.unmarshal();
    }

    public async getDataTable(param: TDataTableParamFilter): Promise<ITableData<IPart>> {
        const dataTable = await this._partRepo.getDataTable(param);

        return dataTable.unmarshal();
    }

    public async store(_part: ICreatePart): Promise<IPart> {
        const line = await this._lineRepo.findById(_part.line_id);
        if (!line) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Line was not found",
            });
        }
        const depEntity = Part.create({
            no_part: _part.no_part,
            name: _part.name,
            line_id: _part.line_id,
            cycle_time: _part.cycle_time,
        });

        const depects = await this._partRepo.store(depEntity, _part.method_id);
        return depects.unmarshal();
    }

    public async update(_part: IUpdatePart, part_id: string): Promise<void> {
        const line = await this._lineRepo.findById(_part.line_id);
        if (!line) {
            throw new AppError({
                statusCode: HttpCode.NOT_FOUND,
                description: "Line was not found",
            });
        }

        const partEntity = Part.create({
            no_part: _part.no_part,
            name: _part.name,
            line_id: _part.line_id,
            cycle_time: _part.cycle_time,
        });

        await this._partRepo.update(part_id, partEntity, _part.method_id);
    }

    public async destroy(part_id: string): Promise<boolean> {
        await this._partRepo.destroy(part_id);
        return true;
    }

    public async importExcel(file: Express.Multer.File, method_id: string[]): Promise<void> {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data: IPart[] = XLSX.utils.sheet_to_json(worksheet);
        const entities: Part[] = await Promise.all(data.map(async (part) => Part.create(part)));

        entities.map((entity) => entity.unmarshal());

        await this._partRepo.import(entities, method_id);
    }

    public async pagination(param: TPagination): Promise<ITableData<IPart>> {
        const dataTable = await this._partRepo.pagination(param);
        return dataTable.unmarshal();
    }
}
