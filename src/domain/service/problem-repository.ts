import { TDataTableParam, TPagination } from "@/domain/service/types";
import { IProblem, Problem } from "../models/problem";
import { TableData } from "../models/table-data";

export interface ProblemRepository {
    findAll(): Promise<Problem[]>;
    findById(problem_id: string): Promise<Problem>;
    getDataTable(param: TDataTableParam): Promise<TableData<IProblem>>;
    store(problem: Problem): Promise<Problem>;
    import(problem: Problem[]): Promise<Problem[]>;
    update(problem_id: string, problem: IProblem): Promise<void>;
    destroy(problem_id: string): Promise<boolean>;
    pagination(param: TPagination): Promise<TableData<IProblem>>;
}
