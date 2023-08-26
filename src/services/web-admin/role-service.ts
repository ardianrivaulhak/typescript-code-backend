import { IRole, Role } from "@/domain/models/role";
import { RoleRepository } from "@/domain/service/role-repository";
import { TYPES } from "@/types";
import { inject, injectable } from "inversify";
import { ITableData } from "@/domain/models/table-data";
import { TDataAssignRoleAccess, TDataTableParam } from "@/domain/service/types";
import { IRoleAccessData, IRoleData } from "@/dto/role-dto";
import { AccessRepository } from "@/domain/service/access-repository";
import { PermissionRepository } from "@/domain/service/permission-repository";
import { AccessPermissionRepository } from "@/domain/service/access-permission-repository";
import { AccessPermission } from "@/domain/models/access_permission";
import { IAccessPermissionDto } from "@/dto/access-dto";
import { IAccess } from "@/domain/models/access";

@injectable()
export class RoleService {
    constructor(
        @inject(TYPES.RoleRepository) private _repositoryRole: RoleRepository,
        @inject(TYPES.AccessRepository) private _repositoryAccess: AccessRepository,
        @inject(TYPES.PermissionRepository) private _repositoryPermission: PermissionRepository,
        @inject(TYPES.AccessPermissionRepository) private _repositoryAccessPermission: AccessPermissionRepository
    ) {}

    private mapperAccessData(accesses: IAccess[] | undefined): IAccessPermissionDto[] {
        const data: IAccessPermissionDto[] = [];
        if (accesses) {
            for (let i = 0; i < accesses?.length; i++) {
                const access: IAccess = accesses[i];
                const index =
                    data.push({
                        id: access.id,
                        name: access.name,
                        parentId: access.parentId,
                        permissions: [],
                        children: [],
                    }) - 1;

                if (access.permissions) {
                    for (let j = 0; j < access.permissions.length; j++) {
                        const permission = access.permissions[j];
                        const permissionData = {
                            id: permission.id,
                            name: permission.name,
                            status: permission.permissionHasAccess?.status,
                            isDisabled: permission.permissionHasAccess?.isDisabled,
                        };
                        data[index]?.permissions?.push(permissionData);
                    }
                }
                if (access.children) {
                    const children = this.mapperAccessData(access.children);
                    for (const child of children) {
                        data[index]?.children?.push(child as IAccessPermissionDto);
                    }
                }
            }
        }
        return data;
    }
    public async findAll(): Promise<IRole[]> {
        const roles = await this._repositoryRole.findAll();
        const dataDto = roles.map((role) => role.unmarshal());
        return dataDto;
    }

    public async findById(id: string): Promise<IRole> {
        const role = await this._repositoryRole.findById(id);
        return role.unmarshal();
    }

    public async store(_role: IRole): Promise<IRole> {
        const role = await this._repositoryRole.store(
            Role.create({
                name: _role.name,
            })
        );
        const accesses = await this._repositoryAccess.findAll();
        const permissions = await this._repositoryPermission.findAll();
        for (let i = 0; i < accesses.length; i++) {
            const access = accesses[i];
            for (let j = 0; j < permissions.length; j++) {
                const permission = permissions[j];
                await this._repositoryAccessPermission.store(
                    AccessPermission.create({
                        status: false,
                        isDisabled: false,
                        roleId: role.id,
                        accessId: access.id,
                        permissionId: permission.id,
                    })
                );
            }
        }
        return role.unmarshal();
    }

    public async update(id: string, _role: IRole): Promise<IRole> {
        const toUpdateUser = Role.create({
            name: _role.name,
        });
        const user = await this._repositoryRole.update(id, toUpdateUser);
        return user.unmarshal();
    }

    public async destroy(id: string): Promise<boolean> {
        await this._repositoryRole.destroy(id);
        return true;
    }

    public async getDataTable(param: TDataTableParam): Promise<ITableData<IRoleData>> {
        const { data, limit, page, search, totalPages, totalRows, nextPages, prevPages } = await this._repositoryRole.getDataTable(param);
        const dataTable = {
            page,
            limit,
            search,
            data: data.map((el) => {
                return {
                    id: el.id,
                    name: el.name,
                };
            }),
            totalPages,
            totalRows,
            nextPages,
            prevPages,
        };
        return dataTable;
    }

    public async assignAccessAndPermission(id: string, param: TDataAssignRoleAccess): Promise<boolean> {
        await this._repositoryRole.assignAccessAndPermission(id, param);
        return true;
    }

    public async getDetailAccessAndPermission(id: string): Promise<IRoleAccessData> {
        const role = await this._repositoryRole.findByIdWithAccessAndPermission(id);
        const accesses = this.mapperAccessData(role.accesses);
        return {
            id: role.id,
            name: role.name,
            accesses,
        };
    }
    // public async getDetailAccessAndPermission(id: string): Promise<IRoleAccessData> {
    //   const role = await this._repositoryRole.findByIdWithAccessAndPermission(id);
    //   const accesses = await this._repositoryAccess.findAllParentAccess();
    //   const data: IRoleAccessData = {
    //     id: role.id,
    //     name: role.name,
    //     accesses: [],
    //   };

    //   accesses.map((access) => {
    //     const found = role.accesses?.find((el) => el.id === access.id);
    //     if (found) {
    //       data.accesses?.push({
    //         id: found.id,
    //         name: found.name,
    //         children: found.children?.map((child) => {
    //           return {
    //             id: child.id,
    //             name: child.name,
    //           };
    //         }),
    //         checked: true,
    //       });
    //     } else {
    //       data.accesses?.push({
    //         id: access.id,
    //         name: access.name,
    //         children: access.children?.map((child) => {
    //           return {
    //             id: child.id,
    //             name: child.name,
    //           };
    //         }),
    //         checked: false,
    //       });
    //     }
    //   });

    //   return data;
    // }
}
