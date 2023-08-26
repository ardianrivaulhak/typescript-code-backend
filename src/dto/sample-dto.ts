export interface ICustomerToOption {
    id:string;
    customerId:string;
    customerName:string;
    address:string;
    phone:string;
}

export interface ICustomerUploadFile {
    parallelism1Path: string;
    parallelism2Path: string;
    gibClearance1Path: string;
    gibClearance2Path: string;
    perpendicularity1Path: string;
    perpendicularity2Path: string;
}

export interface ICustomerPathAndMime {
    id?: string;
    customerId?: string;
    customerName: string;
    address: string;
    phone: string;
    parallelism1Path: {
        path: string;
        mimeType: string;
    };
    parallelism2Path: {
        path: string;
        mimeType: string;
    };
    gibClearance1Path: {
        path: string;
        mimeType: string;
    };
    gibClearance2Path: {
        path: string;
        mimeType: string;
    };
    perpendicularity1Path: {
        path: string;
        mimeType: string;
    };
    perpendicularity2Path: {
        path: string;
        mimeType: string;
    };
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}