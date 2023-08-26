import { Entity } from "./entity";
import { IPermission } from "./permission";

export enum AccessList {
    DASHBOARD = "Dashboard",
    GENERAL = "General",
    MONITORING = "Monitoring",
    PRODUCTION = "Production",
    SCHEDULE = "Schedule",
    REPORT = "Report",
    MASTER_DATA = "Master Data",
    PART = "Part",
    EQUIPMENT = "Equipment",
    MACHINE = "Machine",
    MANPOWER = "Manpower",
    MATERIAL = "Material",
    LINE = "Line",
    PROBLEM = "Problem",
    DATA_DEFECT = "Data Defect",
    METHOD = "Method",
    SHIFT = "Shift",
    USER = "User",
    ACCOUNT = "Account",
    ACCESS = "Access",
}
export interface IAccess {
    id?: string;
    parentId?: string | null | undefined;
    name: string;
    children?: IAccess[];
    permissions?: IPermission[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class Access extends Entity<IAccess> {
    private constructor(props: IAccess) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IAccess): Access {
        const instance = new Access(props);
        return instance;
    }

    public unmarshal(): IAccess {
        return {
            id: this._id,
            parentId: this.parentId,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }

    get id(): string {
        return this._id;
    }
    get parentId(): string | null | undefined {
        return this.props.parentId;
    }
    get name(): string {
        return this.props.name;
    }
    get children(): undefined | IAccess[] {
        return this.props.children;
    }
    get permissions(): undefined | IPermission[] {
        return this.props.permissions;
    }
    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }
    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }
    get deletedAt(): Date | undefined {
        return this.props.deletedAt;
    }
}
