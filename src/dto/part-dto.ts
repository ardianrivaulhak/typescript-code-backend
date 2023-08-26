export interface IListPart {
    id: string;
    name: string;
    no_part: string;
    cycle_time: number;
    line_name: string | undefined;
    method_name: string | undefined;
}

export interface ICreatePart {
    no_part: string;
    name: string;
    line_id: string;
    cycle_time: number;
    method_id: string[];
}

export interface IUpdatePart {
    no_part: string;
    name: string;
    line_id: string;
    cycle_time: number;
    method_id: string[];
}
