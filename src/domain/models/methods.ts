import { Entity } from "./entity";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { IMulterFile } from "@/presentation/validation/types";

export interface IMethod {
    id?: string;
    no_method: string;
    name: string;
    file_url: string | IMulterFile | undefined;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class Method extends Entity<IMethod> {
    private constructor(props: IMethod) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IMethod): Method {
        const instance = new Method(props);

        return instance;
    }

    public unmarshal(): IMethod {
        return {
            id: this.id,
            no_method: this.no_method,
            name: this.name,
            file_url: this.file_url,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }

    get id(): string {
        return this._id;
    }

    get no_method(): string {
        return this.props.no_method;
    }

    get name(): string {
        return this.props.name;
    }

    get file_url(): undefined | string | IMulterFile {
        return this.props.file_url;
    }
    set file_url(val: undefined | string | IMulterFile) {
        this.props.file_url = val;
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
