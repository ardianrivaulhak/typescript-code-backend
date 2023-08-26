export interface IListMachine {
    machine_id: string;
    no_machine: number;
    machine_name: string;
    no_line: number | undefined;
    line_name: string | undefined;
}

export interface IListMachineAuthHmi {
    id: string;
    name: string;
}

export interface IListMachineForParam {
    machine_id: string;
    machine_name: string;
}
