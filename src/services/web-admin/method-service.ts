import { Method, IMethod } from "@/domain/models/methods";
import { injectable, inject } from "inversify";
import { MethodRepository } from "@/domain/service/method-repository";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { FileSystem } from "@/infrastructure/file-system";
import { TYPES } from "@/types";
import { IListMethod, IListMethodForParam } from "@/dto/method-dto";
import * as XLSX from "xlsx";
import { convertToExcel } from "@/presentation/middleware/convertExcel";
@injectable()
export class MethodService {
    constructor(
        @inject(TYPES.MethodRepository)
        private _methodRepository: MethodRepository
    ) {}

    public async findAll(): Promise<IListMethod[]> {
        const methods = await this._methodRepository.findAll();

        const methodsDto: IListMethod[] = methods.map((el) => {
            return {
                id: el.id,
                no_method: el.no_method,
                name: el.name,
            };
        });

        const excelData = convertToExcel(methodsDto);

        const excelBuffer = XLSX.write(excelData, { type: "buffer" });

        return excelBuffer;
    }

    public async getDataTable(param: TDataTableParamFilter): Promise<ITableData<IMethod>> {
        const dataTable = await this._methodRepository.getDataTable(param);

        return dataTable.unmarshal();
    }

    public async findById(method_id: string): Promise<IMethod> {
        const user = await this._methodRepository.findById(method_id);
        return user.unmarshal();
    }

    public async store(_method: IMethod): Promise<IMethod> {
        const methodData = Method.create(_method);

        if (typeof _method.file_url === "object") {
            const file_url = FileSystem.store(_method.file_url, "method");
            methodData.file_url = file_url;
        }
        const method = await this._methodRepository.store(
            Method.create({
                id: _method.id,
                no_method: _method.no_method,
                name: _method.name,
                file_url: methodData.file_url,
            })
        );
        return method.unmarshal();
    }

    public async update(method_id: string, _method: IMethod): Promise<IMethod> {
        const methotData = await this._methodRepository.findById(method_id);
        const methodProps = Method.create(_method);
        if (typeof _method.file_url === "object") {
            const file_url = FileSystem.update(_method.file_url, "method", <string>methotData.file_url);
            methodProps.file_url = file_url;
        }
        const toUpdateUser = Method.create({
            id: _method.id,
            no_method: _method.no_method,
            name: _method.name,
            file_url: methodProps.file_url,
        });
        const method = await this._methodRepository.update(method_id, toUpdateUser);
        return method.unmarshal();
    }

    public async destroy(method_id: string): Promise<boolean> {
        await this._methodRepository.destroy(method_id);
        return true;
    }

    public async importExcel(file: Express.Multer.File): Promise<void> {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data: IMethod[] = XLSX.utils.sheet_to_json(worksheet);
        const entities: Method[] = await Promise.all(data.map(async (method) => Method.create(method)));
        const imported: IMethod[] = entities.map((entity) => entity.unmarshal());
        await this._methodRepository.import(entities);
    }

    public async getAll(): Promise<IListMethodForParam[]>{
        const methods = await this._methodRepository.findAll();

        const methodsDto: IListMethodForParam[] = methods.map((el) => {
            return {
                id: el.id,
                name: el.name,
            };
        });

        return methodsDto;
    }

    public async pagination(param: TPagination): Promise<ITableData<IMethod>> {
        const dataTable = await this._methodRepository.pagination(param);
        return dataTable.unmarshal();
    }
}
