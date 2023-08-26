export interface IManualProductionOrderPayload {
    taskId: string;
    partId: string;
    actualLineId: string;
    qty: number;
    purpose: string;
    startTime: Date;
    finishTime: Date;
}

export interface IProductionOrderPayload {
    scheduleId: string;
    qty: number;
    purpose: string;
}

export interface IProductionOrderSelection {
    id: string;
    poNumber: string;
    partNumber: string;
    qty: number;
}
