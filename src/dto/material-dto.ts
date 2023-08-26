export interface IListMaterial {
    id: string;
    no_material: string;
    name: string;
    qyt: number;
    part_name: string | undefined;
}

export interface IListMaterialHMI {
    id?: string;
    no: string;
    name: string;
    qty: number;
    lotNo?: string;
    remark?: string;
}

export interface IPayloadCreateMaterialLog {
    id: string;
    lotNo?: string;
    remark?: string
}
