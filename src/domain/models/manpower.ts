import { Entity } from "./entity";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { IMulterFile } from "@/presentation/validation/types";
import { IMachine } from "./machine";
import { IPosition } from "./position";

export interface IManpower {
    id?: string;
    machineId: string;
    positionId: string;
    fullname: string;
    shortname: string;
    nip: string;
    machine?: IMachine | undefined;
    position?: IPosition | undefined;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class Manpower extends Entity<IManpower> {
    private constructor(props: IManpower) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IManpower): Manpower {
        const instance = new Manpower(props);

        return instance;
    }

    public unmarshal(): IManpower {
        return {
            id: this.id,
            machineId: this.machineId,
            positionId: this.positionId,
            fullname: this.fullname,
            shortname: this.shortname,
            nip: this.nip,
            machine: this.machine,
            position: this.position,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }

    get id(): string {
        return this._id;
    }

    get machineId(): string {
        return this.props.machineId;
    }

    get positionId(): string {
        return this.props.positionId;
    }

    get fullname(): string {
        return this.props.fullname;
    }

    get shortname(): string {
        return this.props.shortname;
    }

    get nip(): string {
        return this.props.nip;
    }

    get machine(): IMachine | undefined {
        return this.props.machine;
    }

    get position(): IPosition | undefined {
        return this.props.position;
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
