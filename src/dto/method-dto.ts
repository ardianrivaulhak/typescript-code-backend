export interface IListMethod {
    id: string;
    no_method: string;
    name: string;
}
export interface IListMethodForParam {
    id: string;
    name: string;
}


export interface IListMethodHMI {
    id?: string;
    name: string;
    fileUrl: string;
}

export interface IListMethodLogHMI {
    id?: string;
    remark: string;
    reportby: string;
    timestamp: string;
}