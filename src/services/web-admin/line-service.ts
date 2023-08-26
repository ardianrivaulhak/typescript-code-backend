import { Line, ILine } from "@/domain/models/line";
import { injectable, inject } from "inversify";
import { LineRepository } from "@/domain/service/line-repository";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { FileSystem } from "@/infrastructure/file-system";
import { TYPES } from "@/types";
import { IListLine, IListLineForParam } from "@/dto/line-dto";
import { convertToExcel } from "@/presentation/middleware/convertExcel";
import * as XLSX from "xlsx";

@injectable()
export class LineService {
    constructor(
        @inject(TYPES.LineRepository)
        private _lineRepository: LineRepository
    ) {}

    public async findAll(): Promise<IListLine[]> {
        const lines = await this._lineRepository.findAll();

        const linesDto: IListLine[] = lines.map((el) => {
            return {
                id: el.id,
                no_line: el.no_line,
                name: el.name,
            };
        });

        const excelData = convertToExcel(linesDto);

        const excelBuffer = XLSX.write(excelData, { type: "buffer" });

        return excelBuffer;
    }

    public async findById(line_id: string): Promise<ILine> {
        const line: ILine = await this._lineRepository.findById(line_id);
        let lineDto: ILine = {
            no_line: 0,
            name: "",
        };

        if (!line.layout_url) {
            lineDto = {
                id: line.id,
                no_line: line.no_line,
                name: line.name,
            };
        } else {
            lineDto = {
                id: line.id,
                no_line: line.no_line,
                name: line.name,
                layout_url: line.layout_url,
            };
        }

        return lineDto;
    }

    public async store(_line: ILine): Promise<ILine> {
        const depEntity = Line.create(_line);

        const depects = await this._lineRepository.store(depEntity);
        return depects.unmarshal();
    }

    public async layoutStore(_line: ILine, line_id: string): Promise<ILine> {
        const userData = await this._lineRepository.findById(line_id);
        const userProps = Line.create(_line);
        if (typeof _line.layout_url === "object") {
            const layout_url = FileSystem.update(_line.layout_url, "user", <string>userData.layout_url);
            userProps.layout_url = layout_url;
        }
        const toUpdateUser = Line.create({
            id: _line.id,
            no_line: _line.no_line,
            name: _line.name,
            layout_url: userProps.layout_url,
        });
        const user = await this._lineRepository.storeLayoutUrl(line_id, toUpdateUser);
        return user.unmarshal();
    }

    public async update(_line: ILine, line_id: string): Promise<void> {
        const depEntity = Line.create(_line);

        await this._lineRepository.update(line_id, depEntity);
    }

    public async destroy(line_id: string): Promise<boolean> {
        await this._lineRepository.destroy(line_id);
        return true;
    }
    public async getDataTable(param: TDataTableParamFilter): Promise<ITableData<ILine>> {
        const dataTable = await this._lineRepository.getDataTable(param);

        return dataTable.unmarshal();
    }

    public async importExcel(file: Express.Multer.File): Promise<void> {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data: ILine[] = XLSX.utils.sheet_to_json(worksheet);
        const entities: Line[] = await Promise.all(data.map(async (lines) => Line.create(lines)));
        const imported: ILine[] = entities.map((entity) => entity.unmarshal());
        await this._lineRepository.import(entities);
    }

    public async getAll(): Promise<IListLineForParam[]> {
        const lines = await this._lineRepository.findAll();

        const linesDto: IListLineForParam[] = lines.map((el) => {
            return {
                id: el.id,
                name: el.name,
            };
        });

        return linesDto;
    }

    public async pagination(param: TPagination): Promise<ITableData<ILine>> {
        const dataTable = await this._lineRepository.pagination(param);
        return dataTable.unmarshal();
    }
}
