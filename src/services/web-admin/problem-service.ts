import { Problem, IProblem } from "@/domain/models/problem";
import { injectable, inject } from "inversify";
import { ProblemRepository } from "@/domain/service/problem-repository";
import { ITableData } from "@/domain/models/table-data";
import { TDataTableParamFilter, TPagination } from "@/domain/service/types";
import { FileSystem } from "@/infrastructure/file-system";
import { TYPES } from "@/types";
import * as XLSX from "xlsx";
import { convertToExcel } from "@/presentation/middleware/convertExcel";
@injectable()
export class ProblemService {
    constructor(
        @inject(TYPES.ProblemRepository)
        private _probRepository: ProblemRepository
    ) {}

    public async findAll(): Promise<IProblem[]> {
        const problems = await this._probRepository.findAll();

        const problemDto = problems.map((prob) => {
            return {
                id: prob.id,
                name: prob.name,
            };
        });

        const excel = convertToExcel(problemDto);

        const excelBuffer = XLSX.write(excel, { type: "buffer" });

        return excelBuffer;
    }

    public async findById(problem_id: string): Promise<IProblem> {
        const user = await this._probRepository.findById(problem_id);
        return user.unmarshal();
    }

    public async store(_problem: IProblem): Promise<IProblem> {
        const problemEntity = Problem.create(_problem);

        const problem = await this._probRepository.store(problemEntity);
        return problem.unmarshal();
    }

    public async update(_problem: IProblem, problem_id: string): Promise<void> {
        const problemEntity = Problem.create(_problem);

        await this._probRepository.update(problem_id, problemEntity);
    }

    public async importExcel(file: Express.Multer.File): Promise<void> {
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data: IProblem[] = XLSX.utils.sheet_to_json(worksheet);
        const problemEntities: Problem[] = await Promise.all(data.map(async (problem) => Problem.create(problem)));
        const importedProblems: IProblem[] = problemEntities.map((entity) => entity.unmarshal());
        await this._probRepository.import(problemEntities);
    }

    public async destroy(problem_id: string): Promise<boolean> {
        await this._probRepository.destroy(problem_id);
        return true;
    }

    public async getDataTable(param: TDataTableParamFilter): Promise<ITableData<IProblem>> {
        const dataTable = await this._probRepository.getDataTable(param);

        return dataTable.unmarshal();
    }

    public async pagination(param: TPagination): Promise<ITableData<IProblem>> {
        const dataTable = await this._probRepository.pagination(param);
        return dataTable.unmarshal();
    }
}
