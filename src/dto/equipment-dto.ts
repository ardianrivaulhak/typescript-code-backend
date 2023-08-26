export interface IListEquipmentHmi {
    id: string;
    equipmentName?: string;
    equipmentNumber?: string;
}

export interface IPayloadEquipmentHmi {
    equipmentId: string;
    note: string;
}
