import { Role, IRole } from "./role";
import { Entity } from "./entity";
import bcrypt from "bcryptjs";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { IMulterFile } from "@/presentation/validation/types";

export interface IUser {
    id?: string;
    roleId: string;
    email: string;
    password?: string | null;
    name: string;
    isActive: boolean;
    photoUrl?: string | IMulterFile;
    role?: IRole;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class User extends Entity<IUser> {
    private constructor(props: IUser) {
        const { id, ...data } = props;
        super(data, id);
    }

    public static create(props: IUser): User {
        const instance = new User(props);
        return instance;
    }

    public unmarshal(): IUser {
        return {
            id: this._id,
            roleId: this.roleId,
            email: this.email,
            password: this.password,
            name: this.name,
            isActive: this.isActive,
            photoUrl: this.photoUrl,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }

    public verifyPassword(password: string): boolean {
        if (this.password) {
            return bcrypt.compareSync(password, this.password);
        }
        return false;
    }

    get id(): string {
        return this._id;
    }
    get email(): string {
        return this.props.email;
    }
    get password(): string | undefined | null {
        return this.props.password;
    }
    set password(val: string | undefined | null) {
        if (val && val !== "") {
            this.props.password = bcrypt.hashSync(val, 10);
        } else {
            throw new AppError({
                statusCode: HttpCode.VALIDATION_ERROR,
                description: "Password is required",
            });
        }
    }
    get name(): string {
        return this.props.name;
    }
    get isActive(): boolean {
        return this.props.isActive;
    }
    get photoUrl(): undefined | string | IMulterFile {
        return this.props.photoUrl;
    }
    set photoUrl(val: undefined | string | IMulterFile) {
        this.props.photoUrl = val;
    }
    get roleId(): string {
        return this.props.roleId;
    }
    get role(): undefined | IRole {
        return this.props.role;
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
