import { Position, IPosition } from "@/domain/models/position";
import { injectable, inject } from "inversify";
import { PositionRepository } from "@/domain/service/position-repository";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParamFilter } from "@/domain/service/types";
import { FileSystem } from "@/infrastructure/file-system";
import { TYPES } from "@/types";
import * as XLSX from "xlsx";
import { convertToExcel } from "@/presentation/middleware/convertExcel";
import { IListPositionForParam } from "@/dto/position-dto";
@injectable()
export class PositionService {
    constructor(
        @inject(TYPES.PositionRepository)
        private _positionRepository: PositionRepository
    ) {}

    public async findAll(): Promise<IPosition[]> {
        const position = await this._positionRepository.findAll();

        const depectsDto = position.map((prob) => {
            return {
                id: prob.id,
                name: prob.name,
            };
        });

        const excelData = convertToExcel(depectsDto);

        const excelBuffer = XLSX.write(excelData, { type: "buffer" });

        return excelBuffer;
    }

    public async findById(position_id: string): Promise<IPosition> {
        const position = await this._positionRepository.findById(position_id);
        return position.unmarshal();
    }

    public async store(_depects: IPosition): Promise<IPosition> {
        const posEntity = Position.create(_depects);

        const position = await this._positionRepository.store(posEntity);
        return position.unmarshal();
    }

    public async update(_depects: IPosition, position_id: string): Promise<void> {
        const posEntity = Position.create(_depects);

        await this._positionRepository.update(position_id, posEntity);
    }

    public async destroy(position_id: string): Promise<boolean> {
        await this._positionRepository.destroy(position_id);
        return true;
    }
    public async getDataTable(param: TDataTableParamFilter): Promise<ITableData<IPosition>> {
        const dataTable = await this._positionRepository.getDataTable(param);

        return dataTable.unmarshal();
    }

    public async getAll(): Promise<IListPositionForParam[]>{
        const positions = await this._positionRepository.findAll();

        const positionsDto: IListPositionForParam[] = positions.map(el => {
            return {
                id: el.id,
                name: el.name
            };
        });

        return positionsDto;
    }
}
