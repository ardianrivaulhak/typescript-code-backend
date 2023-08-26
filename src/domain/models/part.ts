import { Entity } from "./entity";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { IMulterFile } from "@/presentation/validation/types";
import { ILine } from "./line";
import { IMethod } from "./methods";
import { IEquipment } from "./equipment";
import { IMaterial } from "./material";

export interface IPart {
    id?: string;
    line_id: string;
    no_part: string;
    name: string;
    cycle_time: number;
    line?: ILine | undefined;
    method?: IMethod[];
    equipment?: IEquipment[];
    materials?: IMaterial[];
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class Part extends Entity<IPart> {
    private constructor(props: IPart) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IPart): Part {
        const instance = new Part(props);

        return instance;
    }

    public unmarshal(): IPart {
        return {
            id: this.id,
            line_id: this.line_id,
            line: this.line,
            method: this.method,
            no_part: this.no_part,
            name: this.name,
            cycle_time: this.cycle_time,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }

    get id(): string {
        return this._id;
    }

    get line_id(): string {
        return this.props.line_id;
    }

    get line(): ILine | undefined {
        return this.props.line;
    }

    get method(): IMethod[] {
        return this.props.method || [];
    }

    get equipment(): IEquipment[] {
        return this.props.equipment || [];
    }

    get material(): undefined | IMaterial[] {
        return this.props.materials;
    }

    get no_part(): string {
        return this.props.no_part;
    }

    get name(): string {
        return this.props.name;
    }

    get cycle_time(): number {
        return this.props.cycle_time;
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
